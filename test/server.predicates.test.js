"use strict";

var assert = require('assert');
var vows = require('vows');
var p = require('../src/server/predicates');

vows.describe('predicates')
  .addBatch({
    'checkLevel': {
      'an item without a level': {
        topic: function() {
          return {body: 'nothing'};
        },
        'settings with a critical minimumLevel': {
          topic: function(item) {
            var settings = {minimumLevel: 'critical'};
            return p.checkLevel(item, settings);
          },
          'should not send': function(topic) {
            assert.isFalse(topic);
          }
        }
      },
      'an item with an unknown level': {
        topic: function() {
          return {level: 'wooo'};
        },
        'settings with an error minimumLevel': {
          topic: function(item) {
            var settings = {minimumLevel: 'error'};
            return p.checkLevel(item, settings);
          },
          'should not send': function(topic) {
            assert.isFalse(topic);
          }
        },
        'settings with an unknown minimumLevel': {
          topic: function(item) {
            var settings = {minimumLevel: 'yesss'};
            return p.checkLevel(item, settings);
          },
          'should send': function(topic) {
            assert.isTrue(topic);
          }
        },
        'settings without a minimumLevel': {
          topic: function(item) {
            var settings = {nothing: 'to see here'};
            return p.checkLevel(item, settings);
          },
          'should send': function(topic) {
            assert.isTrue(topic);
          }
        }
      },
      'an item with a warning level': {
        topic: function() {
          return {level: 'warning'};
        },
        'settings with an error minimumLevel': {
          topic: function(item) {
            var settings = {minimumLevel: 'error'};
            return p.checkLevel(item, settings);
          },
          'should not send': function(topic) {
            assert.isFalse(topic);
          }
        },
        'settings with an info minimumLevel': {
          topic: function(item) {
            var settings = {minimumLevel: 'info'};
            return p.checkLevel(item, settings);
          },
          'should send': function(topic) {
            assert.isTrue(topic);
          }
        },
        'settings with a warning minimumLevel': {
          topic: function(item) {
            var settings = {minimumLevel: 'warning'};
            return p.checkLevel(item, settings);
          },
          'should send': function(topic) {
            assert.isTrue(topic);
          }
        }
      }
    }
  }).export(module, {error: false});
