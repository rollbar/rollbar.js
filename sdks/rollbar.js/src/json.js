var RollbarJSON = {};
var testData = {a:[{b:1}]};
try {
  var serialized = JSON.stringify(testData);
  if (serialized !== '{"a":[{"b":1}]}') {
    setupCustomJSON(RollbarJSON);
  } else {
    RollbarJSON.stringify = JSON.stringify;
    RollbarJSON.parse = JSON.parse;
  }
} catch (e) {
  setupCustomJSON(RollbarJSON);
}
