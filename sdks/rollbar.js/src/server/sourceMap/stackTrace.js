var SourceMapConsumer = require('source-map').SourceMapConsumer;
var path = require('path');
var fs = require('fs');

/**
 * Uses Node source-map to map transpiled JS stack locations to original
 * source file locations.
 *
 * The default behavior uses source map comments in the transpiled files
 * to identify the path of source maps. A later enhancement can allow
 * source map paths to be passed in by the caller.
 *
 * These functions are based on https://github.com/evanw/node-source-map-support/blob/master/source-map-support.js
 * simplified to target Node only, and optimized for Rollbar configuration scenarios.
 */

// Maps a file path to a string containing the file contents
var fileContentsCache = {};

// Maps a file path to a source map for that file
var sourceMapCache = {};

// Maps a file path to sourcesContent string
var sourcesContentCache = {};

// Regex for detecting source maps
var reSourceMap = /^data:application\/json[^,]+base64,/;

function retrieveFile(path) {
  // Trim the path to make sure there is no extra whitespace.
  path = path.trim();
  if (/^file:/.test(path)) {
    // existsSync/readFileSync can't handle file protocol, but once stripped, it works
    path = path.replace(/file:\/\/\/(\w:)?/, function(_protocol, drive) {
      return drive ?
        '' : // file:///C:/dir/file -> C:/dir/file
        '/'; // file:///root-dir/file -> /root-dir/file
    });
  }
  if (path in fileContentsCache) {
    return fileContentsCache[path];
  }

  var contents = '';
  try {
    if (fs.existsSync(path)) {
      contents = fs.readFileSync(path, 'utf8');
    }
  } catch (er) {
    /* ignore any errors */
  }

  return fileContentsCache[path] = contents;
}

// Support URLs relative to a directory, but be careful about a protocol prefix
// in case we are in the browser (i.e. directories may start with "http://" or "file:///")
function supportRelativeURL(file, url) {
  if (!file) return url;
  var dir = path.dirname(file);
  var match = /^\w+:\/\/[^\/]*/.exec(dir);
  var protocol = match ? match[0] : '';
  var startPath = dir.slice(protocol.length);
  if (protocol && /^\/\w\:/.test(startPath)) {
    // handle file:///C:/ paths
    protocol += '/';
    return protocol + path.resolve(dir.slice(protocol.length), url).replace(/\\/g, '/');
  }
  return protocol + path.resolve(dir.slice(protocol.length), url);
}

function retrieveSourceMapURL(source) {
  var fileData;

  // Get the URL of the source map
  fileData = retrieveFile(source);
  var re = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/)[ \t]*$)/mg;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  var lastMatch, match;
  while ((match = re.exec(fileData))) lastMatch = match;
  if (!lastMatch) return null;
  return lastMatch[1];
}

// Takes a generated source filename; returns a {map, optional url} object, or null if
// there is no source map.  The map field may be either a string or the parsed
// JSON object (ie, it must be a valid argument to the SourceMapConsumer
// constructor).
function retrieveSourceMap(source) {
  var sourceMappingURL = retrieveSourceMapURL(source);
  if (!sourceMappingURL) return null;

  // Read the contents of the source map
  var sourceMapData;
  if (reSourceMap.test(sourceMappingURL)) {
    // Support source map URL as a data url
    var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(',') + 1);
    sourceMapData = Buffer.from(rawData, 'base64').toString();
    sourceMappingURL = source;
  } else {
    // Support source map URLs relative to the source URL
    sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
    sourceMapData = retrieveFile(sourceMappingURL);
  }

  if (!sourceMapData) {
    return null;
  }

  return {
    url: sourceMappingURL,
    map: sourceMapData
  };
}

function cacheSourceContent(sourceMap, originalSource, newSource) {
  if (sourcesContentCache[newSource]) {
    return;
  }

  // The sourceContentFor lookup needs the original source url as found in the
  // map file. However the client lookup in sourcesContentCache will use
  // a rewritten form of the url, hence originalSource and newSource.
  sourcesContentCache[newSource] = sourceMap.map.sourceContentFor(originalSource, true);
}

exports.mapSourcePosition = function mapSourcePosition(position, diagnostic) {
  var sourceMap = sourceMapCache[position.source];
  if (!sourceMap) {
    // Call the (overrideable) retrieveSourceMap function to get the source map.
    var urlAndMap = retrieveSourceMap(position.source);
    if (urlAndMap) {
      sourceMap = sourceMapCache[position.source] = {
        url: urlAndMap.url,
        map: new SourceMapConsumer(urlAndMap.map)
      };
      diagnostic.node_source_maps.source_mapping_urls[position.source] = urlAndMap.url;

      // Load all sources stored inline with the source map into the file cache
      // to pretend like they are already loaded. They may not exist on disk.
      if (sourceMap.map.sourcesContent) {
        sourceMap.map.sources.forEach(function(source, i) {
          var contents = sourceMap.map.sourcesContent[i];
          if (contents) {
            var url = supportRelativeURL(sourceMap.url, source);
            fileContentsCache[url] = contents;
          }
        });
      }
    } else {
      sourceMap = sourceMapCache[position.source] = {
        url: null,
        map: null
      };
      diagnostic.node_source_maps.source_mapping_urls[position.source] = 'not found';
    }
  }

  // Resolve the source URL relative to the URL of the source map
  if (sourceMap && sourceMap.map && typeof sourceMap.map.originalPositionFor === 'function') {
    var originalPosition = sourceMap.map.originalPositionFor(position);

    // Only return the original position if a matching line was found. If no
    // matching line is found then we return position instead, which will cause
    // the stack trace to print the path and line for the compiled file. It is
    // better to give a precise location in the compiled file than a vague
    // location in the original file.
    if (originalPosition.source !== null) {
      var originalSource = originalPosition.source;
      originalPosition.source = supportRelativeURL(
        sourceMap.url, originalPosition.source);
      cacheSourceContent(sourceMap, originalSource, originalPosition.source);
      return originalPosition;
    }
  }

  return position;
}

exports.sourceContent = function sourceContent(source) {
  return sourcesContentCache[source];
}
