"use strict";

var assert = require('assert');
var vows = require('vows');
var sinon = require('sinon');

var RollbarApi = require('../src/api')('server');

vows.describe('RollbarApi')
  .addBatch({
    'instantiation': {
      topic: function () {
        this.callback(new RollbarApi());
      },
      'creates an instance': function (api) {
        assert(api instanceof RollbarApi);
        assert(typeof api.pendingRequests == 'function');
        assert(typeof api.wait == 'function');
        assert(typeof api.postItem == 'function');
      }
    }
  }).export(module, {error: false});