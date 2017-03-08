var Client = require('../rollbar');
var _ = require('../utility');

var transforms = require('./transforms');
var predicates = require('./predicates');

function Rollbar(options, client) {
  this.options = _.extend(true, {}, options);
  var context = 'browser';
  this.client = client || new Client(context, this.options);
  this.init(this.client);
}

Rollbar.prototype.init = function(client) {
  addTransformsToNotifier(client.notifier);
  addPredicatesToQueue(client.queue);
};

Rollbar.prototype.log = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.log(item);
  return {uuid: uuid};
};

Rollbar.prototype.debug = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.debug(item);
  return {uuid: uuid};
};

Rollbar.prototype.info = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.info(item);
  return {uuid: uuid};
};

Rollbar.prototype.warn = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warn(item);
  return {uuid: uuid};
};

Rollbar.prototype.warning = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warning(item);
  return {uuid: uuid};
};

Rollbar.prototype.error = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.error(item);
  return {uuid: uuid};
};

Rollbar.prototype.critical = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.critical(item);
  return {uuid: uuid};
};

/* Internal */

function addTransformsToNotifier(notifier) {
  notifier
    .addTransform(transforms.handleItemWithError)
    .addTransform(transforms.ensureItemHasSomethingToSay)
    .addTransform(transforms.addBaseInfo)
    .addTransform(transforms.addRequestInfo(window))
    .addTransform(transforms.addClientInfo(window))
    .addTransform(transforms.addPluginInfo(window))
    .addTransform(transforms.addBody)
    .addTransform(transforms.itemToPayload)
    .addTransform(transforms.scrubPayload)
    .addTransform(transforms.userTransform);
}

function addPredicatesToQueue(queue) {
  queue
    .addPredicate(predicates.checkIgnore)
    .addPredicate(predicates.userCheckIgnore)
    .addPredicate(predicates.urlIsWhitelisted)
    .addPredicate(predicates.messageIsIgnored);
}

Rollbar.prototype._createItem = function(args) {
  var message, err, custom, callback;
  var argT, arg;
  var extraArgs = [];

  for (var i = 0, l = args.length; i < l; ++i) {
    arg = args[i];

    switch (_.typeName(arg)) {
      case 'string':
        message ? extraArgs.push(arg) : message = arg;
        break;
      case 'function':
        callback = _.wrapRollbarFunction(arg, this);
        break;
      case 'date':
        extraArgs.push(arg);
        break;
      case 'error':
      case 'domexception':
        err ? extraArgs.push(arg) : err = arg;
        break;
      case 'object':
      case 'array':
        if (arg instanceof Error || (typeof DOMException !== 'undefined' && arg instanceof DOMException)) {
          err ? extraArgs.push(arg) : err = arg;
          break;
        }
        custom ? extraArgs.push(arg) : custom = arg;
        break;
      default:
        if (arg instanceof Error || (typeof DOMException !== 'undefined' && arg instanceof DOMException)) {
          err ? extraArgs.push(arg) : err = arg;
          break;
        }
        extraArgs.push(arg);
    }
  }

  if (extraArgs.length) {
    // if custom is an array this turns it into an object with integer keys
    custom = _.extend(true, {}, custom);
    custom.extraArgs = extraArgs;
  }

  return {
    message: message,
    err: err,
    custom: custom,
    timestamp: (new Date()).getTime(),
    callback: callback,
    uuid: _.uuid4()
  };
};

module.exports = Rollbar;
