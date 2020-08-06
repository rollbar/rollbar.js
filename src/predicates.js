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

function urlIsNotBlacklisted(logger) {
  return function(item, settings) {
    return !urlIsOnAList(item, settings, 'blacklist', logger);
  }
}

function urlIsWhitelisted(logger) {
  return function(item, settings) {
    return urlIsOnAList(item, settings, 'whitelist', logger);
  }
}

function matchFrames(trace, list, black) {
  if (!trace) { return !black }

  var frames = trace.frames;

  if (!frames || frames.length === 0) { return !black; }

  var frame, filename, url, urlRegex;
  var listLength = list.length;
  var frameLength = frames.length;
  for (var i = 0; i < frameLength; i++) {
    frame = frames[i];
    filename = frame.filename;

    if (!_.isType(filename, 'string')) { return !black; }

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

function urlIsOnAList(item, settings, whiteOrBlack, logger) {
  // whitelist is the default
  var black = false;
  if (whiteOrBlack === 'blacklist') {
    black = true;
  }

  var list, traces;
  try {
    list = black ? settings.hostBlackList : settings.hostWhiteList;
    traces = _.get(item, 'body.trace_chain') || [_.get(item, 'body.trace')];

    // These two checks are important to come first as they are defaults
    // in case the list is missing or the trace is missing or not well-formed
    if (!list || list.length === 0) {
      return !black;
    }
    if (traces.length === 0 || !traces[0]) {
      return !black;
    }

    var tracesLength = traces.length;
    for (var i = 0; i < tracesLength; i++) {
      if(matchFrames(traces[i], list, black)) {
        return true;
      }
    }
  } catch (e)
  /* istanbul ignore next */
  {
    if (black) {
      settings.hostBlackList = null;
    } else {
      settings.hostWhiteList = null;
    }
    var listName = black ? 'hostBlackList' : 'hostWhiteList';
    logger.error('Error while reading your configuration\'s ' + listName + ' option. Removing custom ' + listName + '.', e);
    return !black;
  }
  return false;
}

function messageIsIgnored(logger) {
  return function(item, settings) {
    var exceptionMessage, i, ignoredMessages,
        len, messageIsIgnored, rIgnoredMessage,
        body, traceMessage, bodyMessage;

    try {
      messageIsIgnored = false;
      ignoredMessages = settings.ignoredMessages;

      if (!ignoredMessages || ignoredMessages.length === 0) {
        return true;
      }

      body = item.body;
      traceMessage = _.get(body, 'trace.exception.message');
      bodyMessage = _.get(body, 'message.body');

      exceptionMessage = traceMessage || bodyMessage;

      if (!exceptionMessage){
        return true;
      }

      len = ignoredMessages.length;
      for (i = 0; i < len; i++) {
        rIgnoredMessage = new RegExp(ignoredMessages[i], 'gi');
        messageIsIgnored = rIgnoredMessage.test(exceptionMessage);

        if (messageIsIgnored) {
          break;
        }
      }
    } catch(e)
    /* istanbul ignore next */
    {
      settings.ignoredMessages = null;
      logger.error('Error while reading your configuration\'s ignoredMessages option. Removing custom ignoredMessages.');
    }

    return !messageIsIgnored;
  }
}

module.exports = {
  checkLevel: checkLevel,
  userCheckIgnore: userCheckIgnore,
  urlIsNotBlacklisted: urlIsNotBlacklisted,
  urlIsWhitelisted: urlIsWhitelisted,
  messageIsIgnored: messageIsIgnored
};
