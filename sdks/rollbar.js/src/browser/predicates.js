var _ = require('../utility');
var logger = require('./logger');

function checkIgnore(item, settings) {
  var level = item.level;
  var levelVal = _.LEVELS[level] || 0;
  var reportLevel = _.LEVELS[settings.reportLevel] || 0;

  if (levelVal < reportLevel) {
    return false;
  }

  if (_.get(settings, 'plugins.jquery.ignoreAjaxErrors')) {
    return !_.get(item, 'body.message.extra.isAjax');
  }
  return true;
}

function userCheckIgnore(item, settings) {
  var isUncaught = !!item._isUncaught;
  delete item._isUncaught;
  var args = item._originalArgs;
  delete item._originalArgs;
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

function urlIsNotBlacklisted(item, settings) {
  return !urlIsOnAList(item, settings, 'blacklist');
}

function urlIsWhitelisted(item, settings) {
  return urlIsOnAList(item, settings, 'whitelist');
}

function urlIsOnAList(item, settings, whiteOrBlack) {
  // whitelist is the default
  var black = false;
  if (whiteOrBlack === 'blacklist') {
    black = true;
  }
  var list, trace, frame, filename, frameLength, url, listLength, urlRegex;
  var i, j;

  try {
    list = black ? settings.hostBlackList : settings.hostWhiteList;
    listLength = list && list.length;
    trace = _.get(item, 'body.trace');

    // These two checks are important to come first as they are defaults
    // in case the list is missing or the trace is missing or not well-formed
    if (!list || listLength === 0) {
      return !black;
    }
    if (!trace || !trace.frames) {
      return !black;
    }

    frameLength = trace.frames.length;
    for (i = 0; i < frameLength; i++) {
      frame = trace.frames[i];
      filename = frame.filename;

      if (!_.isType(filename, 'string')) {
        return !black;
      }

      for (j = 0; j < listLength; j++) {
        url = list[j];
        urlRegex = new RegExp(url);

        if (urlRegex.test(filename)) {
          return true;
        }
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

function messageIsIgnored(item, settings) {
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

module.exports = {
  checkIgnore: checkIgnore,
  userCheckIgnore: userCheckIgnore,
  urlIsNotBlacklisted: urlIsNotBlacklisted,
  urlIsWhitelisted: urlIsWhitelisted,
  messageIsIgnored: messageIsIgnored
};

