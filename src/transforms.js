var _ = require('./utility');

function itemToPayload(item, options, callback) {
  var payloadOptions = options.payload || {};
  if (payloadOptions.body) {
    delete payloadOptions.body;
  }

  var data = _.extend(true, {}, item.data, payloadOptions);
  if (item._isUncaught) {
    data._isUncaught = true;
  }
  callback(null, data);
}

module.exports = {
  itemToPayload: itemToPayload
};
