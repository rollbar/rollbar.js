var _ = require('../utility');

function checkLevel(item, settings) {
  var level = item.level || 'error';
  // TODO: change minimumLevel to reportLevel to match browser
  var minimumLevel = settings.minimumLevel;

  var levelVal = _.LEVELS[level] || 0;
  var minimumLevelVal = _.LEVELS[minimumLevel] || 0;

  if (levelVal < minimumLevelVal) {
    return false;
  }
  return true;
}

module.exports = {
  checkLevel: checkLevel
};

