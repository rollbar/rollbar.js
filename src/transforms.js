var _ = require('./utility');

function itemToPayload(item, options, callback) {
  var data = item.data;

  if (item._isUncaught) {
    data._isUncaught = true;
  }
  if (item._originalArgs) {
    data._originalArgs = item._originalArgs;
  }
  callback(null, data);
}

function addPayloadOptions(item, options, callback) {
  var payloadOptions = options.payload || {};
  if (payloadOptions.body) {
    delete payloadOptions.body;
  }

  item.data = _.merge(item.data, payloadOptions);
  callback(null, item);
}

function addTelemetryData(item, options, callback) {
  if (item.telemetryEvents) {
    _.set(item, 'data.body.telemetry', item.telemetryEvents);
  }
  callback(null, item);
}

function addMessageWithError(item, options, callback) {
  if (!item.message) {
    callback(null, item);
    return;
  }
  var tracePath = 'data.body.trace_chain.0';
  var trace = _.get(item, tracePath);
  if (!trace) {
    tracePath = 'data.body.trace';
    trace = _.get(item, tracePath);
  }
  if (trace) {
    if (!(trace.exception && trace.exception.description)) {
      _.set(item, tracePath + '.exception.description', item.message);
      callback(null, item);
      return;
    }
    var extra = _.get(item, tracePath + '.extra') || {};
    var newExtra = _.merge(extra, { message: item.message });
    _.set(item, tracePath + '.extra', newExtra);
  }
  callback(null, item);
}

function userTransform(logger) {
  return function (item, options, callback) {
    var newItem = _.merge(item);
    var response = null;
    try {
      if (_.isFunction(options.transform)) {
        response = options.transform(newItem.data, item);
      }
    } catch (e) {
      options.transform = null;
      logger.error(
        'Error while calling custom transform() function. Removing custom transform().',
        e,
      );
      callback(null, item);
      return;
    }
    if (_.isPromise(response)) {
      response.then(
        function (promisedItem) {
          if (promisedItem) {
            newItem.data = promisedItem;
          }
          callback(null, newItem);
        },
        function (error) {
          callback(error, item);
        },
      );
    } else {
      callback(null, newItem);
    }
  };
}

function addConfigToPayload(item, options, callback) {
  if (!options.sendConfig) {
    return callback(null, item);
  }
  var configKey = '_rollbarConfig';
  var custom = _.get(item, 'data.custom') || {};
  custom[configKey] = options;
  item.data.custom = custom;
  callback(null, item);
}

function addFunctionOption(options, name) {
  if (_.isFunction(options[name])) {
    options[name] = options[name].toString();
  }
}

function addConfiguredOptions(item, options, callback) {
  var configuredOptions = options._configuredOptions;

  // These must be stringified or they'll get dropped during serialization.
  addFunctionOption(configuredOptions, 'transform');
  addFunctionOption(configuredOptions, 'checkIgnore');
  addFunctionOption(configuredOptions, 'onSendCallback');

  delete configuredOptions.accessToken;
  item.data.notifier.configured_options = configuredOptions;
  callback(null, item);
}

function addDiagnosticKeys(item, options, callback) {
  var diagnostic = _.merge(
    item.notifier.client.notifier.diagnostic,
    item.diagnostic,
  );

  if (_.get(item, 'err._isAnonymous')) {
    diagnostic.is_anonymous = true;
  }

  if (item._isUncaught) {
    diagnostic.is_uncaught = item._isUncaught;
  }

  if (item.err) {
    try {
      diagnostic.raw_error = {
        message: item.err.message,
        name: item.err.name,
        constructor_name: item.err.constructor && item.err.constructor.name,
        filename: item.err.fileName,
        line: item.err.lineNumber,
        column: item.err.columnNumber,
        stack: item.err.stack,
      };
    } catch (e) {
      diagnostic.raw_error = { failed: String(e) };
    }
  }

  item.data.notifier.diagnostic = _.merge(
    item.data.notifier.diagnostic,
    diagnostic,
  );
  callback(null, item);
}

module.exports = {
  itemToPayload: itemToPayload,
  addPayloadOptions: addPayloadOptions,
  addTelemetryData: addTelemetryData,
  addMessageWithError: addMessageWithError,
  userTransform: userTransform,
  addConfigToPayload: addConfigToPayload,
  addConfiguredOptions: addConfiguredOptions,
  addDiagnosticKeys: addDiagnosticKeys,
};
