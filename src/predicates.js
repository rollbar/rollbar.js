var _ = require('./utility');

function checkLevel(item, settings) {
  var level = item.level;
  var levelVal = _.LEVELS[level] || 0;
  var reportLevel = settings.reportLevel;
  var reportLevelVal = _.LEVELS[reportLevel] || 0;

  if (levelVal < reportLevelVal) {
    return false;
  }
  return true;
}

function userCheckIgnore(logger) {
  return function(item, settings) {
    var isUncaught = !!item._isUncaught;
    delete item._isUncaught;
    var args = item._originalArgs;
    delete item._originalArgs;
    try {
      if (_.isFunction(settings.onSendCallback)) {
        settings.onSendCallback(isUncaught, args, item);
      }
    } catch (e) {
      settings.onSendCallback = null;
      logger.error('Error while calling onSendCallback, removing', e);
    }
    try {
      if (_.isFunction(settings.checkIgnore) && settings.checkIgnore(isUncaught, args, item)) {
        return false;
      }
    } catch (e) {
      settings.checkIgnore = null;
      logger.error('Error while calling custom checkIgnore(), removing', e);
    }
    return true;
  }
}

function urlIsNotBlockListed(logger) {
  return function(item, settings) {
    return !urlIsOnAList(item, settings, 'blocklist', logger);
  }
}

function urlIsSafeListed(logger) {
  return function(item, settings) {
    return urlIsOnAList(item, settings, 'safelist', logger);
  }
}

function matchFrames(trace, list, block) {
  if (!trace) { return !block }

  var frames = trace.frames;

  if (!frames || frames.length === 0) { return !block; }

  var frame, filename, url, urlRegex;
  var listLength = list.length;
  var frameLength = frames.length;
  for (var i = 0; i < frameLength; i++) {
    frame = frames[i];
    filename = frame.filename;

    if (!_.isType(filename, 'string')) { return !block; }

    for (var j = 0; j < listLength; j++) {
      url = list[j];
      urlRegex = new RegExp(url);

      if (urlRegex.test(filename)) {
        return true;
      }
    }
  }
  return false;
}

function urlIsOnAList(item, settings, safeOrBlock, logger) {
  // safelist is the default
  var block = false;
  if (safeOrBlock === 'blocklist') {
    block = true;
  }

  var list, traces;
  try {
    list = block ? settings.hostBlockList : settings.hostSafeList;
    traces = _.get(item, 'body.trace_chain') || [_.get(item, 'body.trace')];

    // These two checks are important to come first as they are defaults
    // in case the list is missing or the trace is missing or not well-formed
    if (!list || list.length === 0) {
      return !block;
    }
    if (traces.length === 0 || !traces[0]) {
      return !block;
    }

    var tracesLength = traces.length;
    for (var i = 0; i < tracesLength; i++) {
      if(matchFrames(traces[i], list, block)) {
        return true;
      }
    }
  } catch (e)
  /* istanbul ignore next */
  {
    if (block) {
      settings.hostBlockList = null;
    } else {
      settings.hostSafeList = null;
    }
    var listName = block ? 'hostBlockList' : 'hostSafeList';
    logger.error('Error while reading your configuration\'s ' + listName + ' option. Removing custom ' + listName + '.', e);
    return !block;
  }
  return false;
}

function messageIsIgnored(logger) {
  return function(item, settings) {
    var i, j, ignoredMessages, len, messageIsIgnored, rIgnoredMessage, messages;

    try {
      messageIsIgnored = false;
      ignoredMessages = settings.ignoredMessages;

      if (!ignoredMessages || ignoredMessages.length === 0) {
        return true;
      }

      messages = messagesFromItem(item);

      if (messages.length === 0){
        return true;
      }

      len = ignoredMessages.length;
      for (i = 0; i < len; i++) {
        rIgnoredMessage = new RegExp(ignoredMessages[i], 'gi');

        for (j = 0; j < messages.length; j++) {
          messageIsIgnored = rIgnoredMessage.test(messages[j]);

          if (messageIsIgnored) {
            return false;
          }
        }
      }
    } catch(e)
    /* istanbul ignore next */
    {
      settings.ignoredMessages = null;
      logger.error('Error while reading your configuration\'s ignoredMessages option. Removing custom ignoredMessages.');
    }

    return true;
  }
}

function messagesFromItem(item) {
  var body = item.body;
  var messages = [];

  // The payload schema only allows one of trace_chain, message, or trace.
  // However, existing test cases are based on having both trace and message present.
  // So here we preserve the ability to collect strings from any combination of these keys.
  if (body.trace_chain) {
    var traceChain = body.trace_chain;
    for (var i = 0; i < traceChain.length; i++) {
      var trace = traceChain[i];
      messages.push(_.get(trace, 'exception.message'));
    }
  }
  if (body.trace) {
    messages.push(_.get(body, 'trace.exception.message'));
  }
  if (body.message) {
    messages.push(_.get(body, 'message.body'));
  }
  return messages;
}

module.exports = {
  checkLevel: checkLevel,
  userCheckIgnore: userCheckIgnore,
  urlIsNotBlockListed: urlIsNotBlockListed,
  urlIsSafeListed: urlIsSafeListed,
  messageIsIgnored: messageIsIgnored
};
