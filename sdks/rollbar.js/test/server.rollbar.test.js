"use strict";

var assert = require('assert');
var vows = require('vows');
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
        }
      }
    },
    'log': {
      topic: function() {
        var client = new (TestClientGen())();
        var rollbar = new Rollbar({accessToken: 'abc123'}, client);
        return rollbar;
      },
      'should create an item with extra data': function(r) {
        r.log('hello', {req: 'a'}, {stuff: 'more'});
        assert.equal(r.client.logCalls[0].item.custom.stuff, 'more')
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
