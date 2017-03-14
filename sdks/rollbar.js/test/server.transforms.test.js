"use strict";

var assert = require('assert');
var util = require('util');
var vows = require('vows');
var t = require('../src/server/transforms');
var rollbar = require('../src/server/rollbar');

function CustomError(message, nested) {
  rollbar.Error.call(this, message, nested);
}
util.inherits(CustomError, rollbar.Error);

vows.describe('transforms')
  .addBatch({
    'baseData': {
      'options': {
        'blank': {
          topic: function() {
            return {};
          },
          'item': {
            'empty': {
              topic: function(options) {
                var item = {};
                t.baseData(item, options, this.callback);
              },
              'should have a timestamp': function(err, item) {
                assert.ifError(err);
                assert.notEqual(item.data, undefined);
                assert.notEqual(item.data.timestamp, undefined);
              },
              'should have an error level': function(err, item) {
                assert.ifError(err);
                assert.notEqual(item.data, undefined);
                assert.equal(item.data.level, 'error');
              },
              'should have some defaults': function(err, item) {
                assert.ifError(err);
                var data = item.data;
                assert.equal(data.environment, 'development');
                assert.equal(data.framework, 'node-js');
                assert.equal(data.language, 'javascript');
                assert.ok(data.server);
                assert.ok(data.server.host);
                assert.ok(data.server.pid);
              }
            },
            'with values': {
              topic: function(options) {
                var item = {
                  level: 'critical',
                  framework: 'star-wars',
                  uuid: '12345',
                  environment: 'production',
                  custom: {
                    one: 'a1',
                    stuff: 'b2',
                    language: 'english'
                  }
                };
                t.baseData(item, options, this.callback);
              },
              'should have a critical level': function(err, item) {
                assert.ifError(err);
                assert.equal(item.data.level, 'critical');
              },
              'should have the defaults overriden by the item': function(err, item) {
                assert.ifError(err);
                assert.equal(item.data.environment, 'production');
                assert.equal(item.data.framework, 'star-wars');
                assert.equal(item.data.language, 'javascript');
                assert.equal(item.data.uuid, '12345');
              },
              'should have data from custom': function(err, item) {
                assert.equal(item.data.one, 'a1');
                assert.equal(item.data.stuff, 'b2');
                assert.notEqual(item.data.language, 'english');
              }
            }
          }
        },
        'with values': {
          topic: function() {
            return {
              environment: 'opt-prod',
              framework: 'opt-node',
              host: 'opt-host',
              branch: 'opt-master'
            };
          },
          'item': {
            'empty': {
              topic: function(options) {
                var item = {};
                t.baseData(item, options, this.callback);
              },
              'should have a timestamp': function(err, item) {
                assert.ifError(err);
                assert.notEqual(item.data, undefined);
                assert.notEqual(item.data.timestamp, undefined);
              },
              'should have an error level': function(err, item) {
                assert.ifError(err);
                assert.notEqual(item.data, undefined);
                assert.equal(item.data.level, 'error');
              },
              'should have data from options and defaults': function(err, item) {
                assert.ifError(err);
                var data = item.data;
                assert.equal(data.environment, 'opt-prod');
                assert.equal(data.framework, 'opt-node');
                assert.equal(data.language, 'javascript');
                assert.ok(data.server);
                assert.equal(data.server.host, 'opt-host');
                assert.equal(data.server.branch, 'opt-master');
                assert.ok(data.server.pid);
              }
            },
            'with values': {
              topic: function(options) {
                var item = {
                  level: 'critical',
                  framework: 'star-wars',
                  uuid: '12345',
                  environment: 'production',
                  custom: {
                    one: 'a1',
                    stuff: 'b2',
                    language: 'english'
                  }
                };
                t.baseData(item, options, this.callback);
              },
              'should have a critical level': function(err, item) {
                assert.ifError(err);
                assert.equal(item.data.level, 'critical');
              },
              'should have the defaults overriden by the item': function(err, item) {
                assert.ifError(err);
                assert.equal(item.data.environment, 'production');
                assert.equal(item.data.framework, 'star-wars');
                assert.equal(item.data.language, 'javascript');
                assert.equal(item.data.uuid, '12345');
              },
              'should have data from custom': function(err, item) {
                assert.equal(item.data.one, 'a1');
                assert.equal(item.data.stuff, 'b2');
                assert.notEqual(item.data.language, 'english');
              }
            }
          }
        }
      }
    }
  })
  .addBatch({
    'addMessageData': {
      'options': {
        'anything': {
          topic: function() {
            return {random: 'stuff'};
          },
          'item': {
            'no message': {
              topic: function(options) {
                var item = {err: 'stuff', not: 'a message'};
                t.addMessageData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should add an empty body': function(err, item) {
                assert.ok(item.data.body);
              }
            },
            'with a message': {
              topic: function(options) {
                var item = {message: 'this is awesome'};
                t.addMessageData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should add a body with the message': function(err, item) {
                assert.equal(item.data.body.message.body, 'this is awesome');
              }
            }
          }
        }
      }
    }
  })
  .addBatch({
    'buildErrorData': {
      'options': {
        'anything': {
          topic: function() {
            return {some: 'stuff'};
          },
          'item': {
            'no error': {
              topic: function(options) {
                var item = {
                  data: {body: {yo: 'hey'}},
                  message: 'hey'
                };
                t.buildErrorData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should not change the item': function(err, item) {
                assert.equal(item.data.body.yo, 'hey');
              }
            },
            'with a simple error': {
              topic: function (options) {
                var item = {
                  data: {body: {}},
                  err: new Error('wookie')
                };
                t.buildErrorData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should add some data to the trace_chain': function(err, item) {
                assert.ok(item.data.body.trace_chain);
              }
            },
            'with a normal error': {
              topic: function (options) {
                var test = function() {
                  var x = thisVariableIsNotDefined;
                };
                var err;
                try {
                  test();
                } catch (e) {
                  err = e;
                }
                var item = {
                  data: {body: {}},
                  err: err
                };
                t.buildErrorData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should add some data to the trace_chain': function(err, item) {
                assert.ok(item.data.body.trace_chain);
              }
            },
            'with a nested error': {
              topic: function (options) {
                var test = function() {
                  var x = thisVariableIsNotDefined;
                };
                var err;
                try {
                  test();
                } catch (e) {
                  err = new CustomError('nested-message', e);
                }
                var item = {
                  data: {body: {}},
                  err: err
                };
                t.buildErrorData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should have the right data in the trace_chain': function(err, item) {
                var trace_chain = item.data.body.trace_chain;
                assert.lengthOf(trace_chain, 2);
                assert.equal(trace_chain[0].exception.class, 'CustomError');
                assert.equal(trace_chain[0].exception.message, 'nested-message');
                assert.equal(trace_chain[1].exception.class, 'ReferenceError');
              }
            }
          }
        }
      }
    }
  })
  .export(module, {error: false});
