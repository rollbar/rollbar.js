var _ = require('../utility');
var logger = require('./logger');

function checkLevel(item, settings) {
  var level = item.level || 'error';
  var reportLevel = settings.reportLevel;

  var levelVal = _.LEVELS[level] || 0;
  var reportLevelVal = _.LEVELS[reportLevel] || 0;

  if (levelVal < reportLevelVal) {
    var msg = 'Level ' + level;
    msg += ' is less than configured reporting level of ';
    msg += reportLevel;
    return {err: new Error(msg)};
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
      return {err: new Error('Ignored by checkIgnore function')};
    }
  } catch (e) {
    settings.checkIgnore = null;
    logger.error('Error while calling custom checkIgnore(), removing', e);
  }
  return true;
}

module.exports = {
  checkLevel: checkLevel,
  userCheckIgnore: userCheckIgnore
};

