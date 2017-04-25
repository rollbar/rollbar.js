"use strict";

var assert = require('assert');
var vows = require('vows');
var Rollbar = require('../src/server/rollbar');

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
    }
  }).export(module, {error: false});
