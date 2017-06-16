var _ = require('../utility');

function checkLevel(item, settings) {
  var level = item.level || 'error';
  var reportLevel = settings.reportLevel;

  var levelVal = _.LEVELS[level] || 0;
  var reportLevelVal = _.LEVELS[reportLevel] || 0;

  if (levelVal < reportLevelVal) {
    return false;
  }
  return true;
}

module.exports = {
  checkLevel: checkLevel
};

