"use strict";

var assert = require('assert');
var vows = require('vows');
var sinon = require('sinon');
var nockBack = require('nock').back;
var RollbarApi = require('../src/api')('server');
var request = require('request');

nockBack.setMode('record'); // Set to "record" to re-record the tests
nockBack.fixtures = __dirname + '/nock_fixtures';

vows.describe('RollbarApi')
  .addBatch({
    'instantiation': {
      topic: function() {
        this.callback(new RollbarApi());
      },
      'creates an instance': function (api) {
        assert(api instanceof RollbarApi);
        assert(typeof api.pendingRequests == 'function');
        assert(typeof api.wait == 'function');
        assert(typeof api.postItem == 'function');
      }
    }
  })

  // This batch is an example of how to use Nock to mock HTTP requests.
  // We can remove this eventually once we have real examples in here.
  .addBatch({
    'nock': {
      topic: function() {
        var cb = this.callback;
        nockBack('nock-example.json', function(nockDone) {
          request.get('http://zombo.com', function(err, res, body) {
            cb(body, nockDone);
          });
        });
      },
      'records http interaction': function(body, nockDone) {
        assert(body);
        nockDone();
      }
    }
  }).export(module, {error: false});