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

function urlIsWhitelisted(item, settings) {
  var whitelist, trace, frame, filename, frameLength, url, listLength, urlRegex;
  var i, j;

  try {
    whitelist = settings.hostWhiteList;
    listLength = whitelist && whitelist.length;
    trace = _.get(item, 'body.trace');

    if (!whitelist || listLength === 0) {
      return true;
    }
    if (!trace || !trace.frames) {
      return true;
    }

    frameLength = trace.frames.length;
    for (i = 0; i < frameLength; i++) {
      frame = trace.frames[i];
      filename = frame.filename;

      if (!_.isType(filename, 'string')) {
        return true;
      }

      for (j = 0; j < listLength; j++) {
        url = whitelist[j];
        urlRegex = new RegExp(url);

        if (urlRegex.test(filename)){
          return true;
        }
      }
    }
  } catch (e)
  /* istanbul ignore next */
  {
    settings.hostWhiteList = null;
    logger.error('Error while reading your configuration\'s hostWhiteList option. Removing custom hostWhiteList.', e);
    return true;
  }
  return false;
}

function messageIsIgnored(item, settings) {
  var exceptionMessage, i, ignoredMessages, len, messageIsIgnored, rIgnoredMessage, trace, body, traceMessage, bodyMessage;
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
  urlIsWhitelisted: urlIsWhitelisted,
  messageIsIgnored: messageIsIgnored
};

