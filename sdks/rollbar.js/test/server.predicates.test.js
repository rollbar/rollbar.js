"use strict";

var assert = require('assert');
var vows = require('vows');
var p = require('../src/predicates');

vows.describe('predicates')
  .addBatch({
    'checkLevel': {
      'an item without a level': {
        topic: function() {
          return {body: 'nothing'};
        },
        'settings with a critical reportLevel': {
          topic: function(item) {
            var settings = {reportLevel: 'critical'};
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
        'settings with an error reportLevel': {
          topic: function(item) {
            var settings = {reportLevel: 'error'};
            return p.checkLevel(item, settings);
          },
          'should not send': function(topic) {
            assert.isFalse(topic);
          }
        },
        'settings with an unknown reportLevel': {
          topic: function(item) {
            var settings = {reportLevel: 'yesss'};
            return p.checkLevel(item, settings);
          },
          'should send': function(topic) {
            assert.isTrue(topic);
          }
        },
        'settings without a reportLevel': {
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
        'settings with an error reportLevel': {
          topic: function(item) {
            var settings = {reportLevel: 'error'};
            return p.checkLevel(item, settings);
          },
          'should not send': function(topic) {
            assert.isFalse(topic);
          }
        },
        'settings with an info reportLevel': {
          topic: function(item) {
            var settings = {reportLevel: 'info'};
            return p.checkLevel(item, settings);
          },
          'should send': function(topic) {
            assert.isTrue(topic);
          }
        },
        'settings with a warning reportLevel': {
          topic: function(item) {
            var settings = {reportLevel: 'warning'};
            return p.checkLevel(item, settings);
          },
          'should send': function(topic) {
            assert.isTrue(topic);
          }
        }
      }
    }
  }).export(module, {error: false});
