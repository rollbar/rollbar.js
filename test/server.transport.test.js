"use strict";

var assert = require('assert');
var util = require('util');
var vows = require('vows');
var t = require('../src/server/transport');

vows.describe('transport')
  .addBatch({
    'post': {
      'base data': {
        topic: function() {
          return {
            accessToken: 'abc123',
            options: {},
            payload: {
              access_token: 'abc123',
              data: {a: 1}
            }
          };
        },
        'with no payload': {
          topic: function(data) {
            var factory = transportFactory(null, '{"err": null, "result":"all good"}');
            t.post(data.accessToken, data.options, null, this.callback, factory);
          },
          'should have an error': function(err, resp) {
            assert.ok(err);
          }
        },
        'with a payload and no error': {
          topic: function(data) {
            var factory = transportFactory(null, '{"err": null, "result":{"uuid":"42def", "message":"all good"}}',
                function() {
                  assert.equal(this.options.headers['Content-Type'], 'application/json');
                  assert.isNumber(this.options.headers['Content-Length']);
                  assert(this.options.headers['Content-Length'] > 0);
                  assert.equal(this.options.headers['X-Rollbar-Access-Token'], data.accessToken); 
                });
            t.post(data.accessToken, data.options, data.payload, this.callback, factory);
          },
          'should not error': function(err, resp) {
            assert.ifError(err);
          },
          'should have the right response data': function(err, resp) {
            assert.equal(resp.message, 'all good');
          }
        },
        'with a payload and an error in the response': {
          topic: function(data) {
            var factory = transportFactory(null, '{"err": "bork", "message":"things broke"}',
                function() {
                  assert.equal(this.options.headers['Content-Type'], 'application/json');
                  assert.isNumber(this.options.headers['Content-Length']);
                  assert(this.options.headers['Content-Length'] > 0);
                  assert.equal(this.options.headers['X-Rollbar-Access-Token'], data.accessToken); 
                });
            t.post(data.accessToken, data.options, data.payload, this.callback, factory);
          },
          'should error': function(err, resp) {
            assert.ok(err);
          },
          'should have the message somewhere': function(err, resp) {
            assert.match(err.message, /things broke/);
          },
          'should not have a response': function(err, resp) {
            assert.ifError(resp);
          }
        },
        'with a payload and an error during sending': {
          topic: function(data) {
            var factory = transportFactory(new Error('bork'), null,
                function() {
                  assert.equal(this.options.headers['Content-Type'], 'application/json');
                  assert.isNumber(this.options.headers['Content-Length']);
                  assert(this.options.headers['Content-Length'] > 0);
                  assert.equal(this.options.headers['X-Rollbar-Access-Token'], data.accessToken); 
                });
            t.post(data.accessToken, data.options, data.payload, this.callback, factory);
          },
          'should error': function(err, resp) {
            assert.ok(err);
          },
          'should have the message somewhere': function(err, resp) {
            assert.match(err.message, /bork/);
          },
          'should not have a response': function(err, resp) {
            assert.ifError(resp);
          }
        }
      }
    }
  })
  .export(module, {error: false});

var TestTransport = function(options, error, response, assertions) {
  this.options = options;
  this.error = error;
  this.response = response;
  this.requestOpts = null;
  this.requestCallback = null;
  this.assertions = assertions;
};
var TestRequest = function(error, response, transport) {
  this.error = error;
  this.responseData = response;
  this.data = [];
  this.events = {};
  this.transport = transport;
  this.response = null;
};
TestTransport.prototype.request = function(opts, cb) {
  this.requestOpts = opts;
  this.requestCallback = cb;
  return new TestRequest(this.error, this.response, this);
};
TestRequest.prototype.write = function(data) {
  this.data.push(data);
};
TestRequest.prototype.on = function(event, cb) {
  this.events[event] = cb;
};
TestRequest.prototype.end = function() {
  if (this.transport.assertions) {
    this.transport.assertions();
  }
  if (this.error) {
    if (this.events['error']) {
      this.events['error'](this.error);
    }
  } else {
    this.response = new TestResponse();
    this.transport.requestCallback(this.response);
    if (this.response.events['data']) {
      this.response.events['data'](this.responseData);
    }
    if (this.response.events['end']) {
      this.response.events['end']();
    }
  }
};
var TestResponse = function() {
  this.encoding = null;
  this.events = {};
};
TestResponse.prototype.setEncoding = function(s) {
  this.encoding = s;
}
TestResponse.prototype.on = function(event, cb) {
  this.events[event] = cb;
};
var transportFactory = function(error, response, assertions) {
  return function(options) {
    return new TestTransport(options, error, response, assertions);
  };
};

