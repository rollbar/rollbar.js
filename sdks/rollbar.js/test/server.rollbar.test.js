'use strict';

var assert = require('assert');
var vows = require('vows');

process.env.NODE_ENV = process.env.NODE_ENV || 'test-node-env';
var Rollbar = require('../src/server/rollbar');

function TestClientGen() {
  var TestClient = function() {
    this.notifier = {
      addTransform: function() { return this; }
    };
    this.queue = {
      addPredicate: function() { return this; }
    };
    this.logCalls = [];
    var logs = 'log,debug,info,warn,wanring,error,critical'.split(',');
    for(var i=0, len=logs.length; i < len; i++) {
      var fn = logs[i].slice(0);
      this[fn] = function(fn, item) {
        this.logCalls.push({func: fn, item: item});
      }.bind(this, fn)
    }
    this.clearLogCalls = function() {
      this.logCalls = [];
    };
  };

  return TestClient;
}

vows.describe('rollbar')
  .addBatch({
    'constructor': {
      'with accessToken': {
        topic: function() {
          return new Rollbar('abc123');
        },
        'should have log method': function(r) {
          assert.isFunction(r.log);
        },
        'should have error method': function(r) {
          assert.isFunction(r.error);
        },
        'should have accessToken in options': function(r) {
          assert.equal('abc123', r.options.accessToken);
        }
      },
      'with options': {
        topic: function() {
          return new Rollbar({accessToken: 'abc123'});
        },
        'should have log method': function(r) {
          assert.isFunction(r.log);
        },
        'should have error method': function(r) {
          assert.isFunction(r.error);
        },
        'should have accessToken in options': function(r) {
          assert.equal('abc123', r.options.accessToken);
        },
        'should set environment based on default': function(r) {
          assert.equal(process.env.NODE_ENV, r.options.environment);
        }
      },
      'with more options': {
        topic: function() {
          return new Rollbar({accessToken: 'abc123', environment: 'fake-env'});
        },
        'should have log method': function(r) {
          assert.isFunction(r.log);
        },
        'should have error method': function(r) {
          assert.isFunction(r.error);
        },
        'should have accessToken in options': function(r) {
          assert.equal('abc123', r.options.accessToken);
        },
        'should set environment based on options': function(r) {
          assert.equal('fake-env', r.options.environment);
        }
      }
    },
    'log': {
      topic: function() {
        var client = new (TestClientGen())();
        var rollbar = new Rollbar({accessToken: 'abc123'}, client);
        return rollbar;
      },
      'message': {
        'with unordered options': {
          'should work with custom, request, callback, message ': function(r) {
            var message = 'hello';
            var callbackCalled = false;
            var callback = function cb() {
              callbackCalled = true;
            };
            var request = { method: 'GET' };
            var custom = { a: 1, b: 2 };
            r.log(custom, request, callback, message);
            var item = r.client.logCalls[r.client.logCalls.length - 1].item;
            assert.equal(item.message, message);
            assert.equal(item.request, request);
            assert.equal(item.custom, custom);
            item.callback();
            assert.isTrue(callbackCalled);
          }
        },
        'with old option ordering': {
          'should work': function(r) {
            var message = 'hello'
            r.log(message)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.message, message)
          },
          'should work with callback': function(r) {
            var message = 'hello'
            var callbackCalled = false;
            var callback = function cb() {
              callbackCalled = true;
            };
            r.log(message, callback);
            var item = r.client.logCalls[r.client.logCalls.length - 1].item;
            assert.equal(item.message, message);
            item.callback();
            assert.isTrue(callbackCalled);
          },
          'should work with request': function(r) {
            var message = 'hello'
            var request = { method: 'GET' }
            r.log(message, request)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.message, message)
            assert.equal(item.request, request)
          },
          'should work with request and callback': function(r) {
            var message = 'hello'
            var request = { method: 'GET' }
            var callbackCalled = false;
            var callback = function cb() {
              callbackCalled = true;
            };
            r.log(message, request, callback)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.message, message)
            assert.equal(item.request, request)
            item.callback();
            assert.isTrue(callbackCalled);
          },
          'should work with request and custom': function(r) {
            var message = 'hello'
            var request = { method: 'GET' }
            var custom = { a: 1, b: 2 }
            r.log(message, request, custom)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.message, message)
            assert.equal(item.request, request)
            assert.equal(item.custom, custom)
          },
          'should work with request and custom and callback': function(r) {
            var message = 'hello'
            var request = { method: 'GET' }
            var custom = { a: 1, b: 2 }
            var callbackCalled = false;
            var callback = function cb() {
              callbackCalled = true;
            };
            r.log(message, request, custom, callback)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.message, message)
            assert.equal(item.request, request)
            assert.equal(item.custom, custom)
            item.callback();
            assert.isTrue(callbackCalled);
          }
        }
      },
      'error': {
        'with unordered options': {
          'should work with custom, request, callback, message ': function(r) {
            var err = new Error('hello!')
            var callbackCalled = false;
            var callback = function cb() {
              callbackCalled = true;
            };
            var request = { method: 'GET' }
            var custom = { a: 1, b: 2 }
            r.log(custom, request, callback, err)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.err, err)
            assert.equal(item.request, request)
            assert.equal(item.custom, custom)
            item.callback();
            assert.isTrue(callbackCalled);
          }
        },
        'with old option ordering': {
          'should work': function(r) {
            var err = new Error('hello!')
            r.log(err)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.err, err)
          },
          'should work with callback': function(r) {
            var err = new Error('hello!')
            var callbackCalled = false;
            var callback = function cb() {
              callbackCalled = true;
            };
            r.log(err, callback)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.err, err)
            item.callback();
            assert.isTrue(callbackCalled);
          },
          'should work with request': function(r) {
            var err = new Error('hello!')
            var request = { method: 'GET' }
            r.log(err, request)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.err, err)
            assert.equal(item.request, request)
          },
          'should work with request and callback': function(r) {
            var err = new Error('hello!')
            var request = { method: 'GET' }
            var callbackCalled = false;
            var callback = function cb() {
              callbackCalled = true;
            };
            r.log(err, request, callback)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.err, err)
            assert.equal(item.request, request)
            item.callback();
            assert.isTrue(callbackCalled);
          },
          'should work with request and custom': function(r) {
            var err = new Error('hello!')
            var request = { method: 'GET' }
            var custom = { a: 1, b: 2 }
            r.log(err, request, custom)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.err, err)
            assert.equal(item.request, request)
            assert.equal(item.custom, custom)
          },
          'should work with request and custom and callback': function(r) {
            var err = new Error('hello!')
            var request = { method: 'GET' }
            var custom = { a: 1, b: 2 }
            var callbackCalled = false;
            var callback = function cb() {
              callbackCalled = true;
            };
            r.log(err, request, custom, callback)
            var item = r.client.logCalls[r.client.logCalls.length - 1].item
            assert.equal(item.err, err)
            assert.equal(item.request, request)
            assert.equal(item.custom, custom)
            item.callback();
            assert.isTrue(callbackCalled);
          }
        }
      }
    },
    'singleton': {
      topic: function() {
        var client = new (TestClientGen())();
        return Rollbar.init({accessToken: 'abc123'}, client);
      },
      'should allow log on constructor to pass through': function(r) {
        r.log('hello 1');
        Rollbar.log('hello 2');
        assert.equal(r.client.logCalls[0].item.message, 'hello 1');
        assert.equal(r.client.logCalls[1].item.message, 'hello 2');
      }
    }
  }).export(module, {error: false});
