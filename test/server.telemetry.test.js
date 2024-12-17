'use strict';

var assert = require('assert');
var vows = require('vows');
var sinon = require('sinon');
var nock = require('nock');
var http = require('http');
var https = require('https');

process.env.NODE_ENV = process.env.NODE_ENV || 'test-node-env';
var Rollbar = require('../src/server/rollbar');
var { mergeOptions } = require('../src/server/telemetry/urlHelpers');
const { URL } = require('url');

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function uncaught() {
  setTimeout(function () {
    throw new Error('rollbar error');
  }, 1);
  await wait(300);
}

async function message(rollbar) {
  setTimeout(function () {
    rollbar.info('rollbar info message');
  }, 1);
  await wait(300);
}

function request(transport, url, options, body) {
  return new Promise((resolve, reject) => {
    var req = url
      ? transport.request(url, options)
      : transport.request(options);

    req.on('response', (res) => {
      resolve(res);
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

function requestWithCallback(transport, options, body) {
  return new Promise((resolve, reject) => {
    var req = transport.request(options, function (res) {
      resolve(res);
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

function stubPostWithResponse(url, status, headers, body) {
  return nock(url).post('/api/users').reply(status, body, headers);
}

function stubGetWithResponse(url, status, headers, body) {
  return nock(url).get('/api/users').reply(status, body, headers);
}

function stubGetWithError(url) {
  return nock(url).get('/api/users').replyWithError('dns error');
}

var testHeaders1 = {
  'Content-Type': 'application/json',
  'X-access-token': '123',
};
var testHeaders2 = { authorization: 'abc', foo: '456' };
var testHeaders3 = { 'content-type': 'application/json', foo: '123' };
var testHeaders4 = { authorization: 'abc', bar: '456' };
var testBody1 = 'test body 1';
var testBody2 = 'test body 2';
var testMessage1 = 'test console message';
var testMessage2 = 'test console error message';
var testMessagePart = ', extra part';

vows
  .describe('telemetry')
  .addBatch({
    'with log and network capture enabled': {
      topic: function () {
        var rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
          autoInstrument: true,
        });
        rollbar.testData = {};
        var notifier = rollbar.client.notifier;
        rollbar.testData.addItemStub = sinon.stub(notifier.queue, 'addItem');
        rollbar.testData.getStub = stubGetWithResponse(
          'http://example.com',
          200,
          testHeaders3,
          testBody1,
        );
        rollbar.testData.postStub = stubPostWithResponse(
          'https://example.com',
          201,
          testHeaders4,
          testBody2,
        );

        var func = async function (callback) {
          // Invoke telemetry events
          console.info(testMessage1, testMessagePart);
          rollbar.testData.response1 = await request(
            http,
            'http://example.com/api/users',
            { method: 'GET', headers: testHeaders1 },
          );
          console.error(testMessage2);
          rollbar.testData.response2 = await request(
            https,
            'https://example.com/api/users',
            { method: 'POST', headers: testHeaders2 },
          );

          await uncaught(rollbar);
          callback(rollbar);
        };
        func(this.callback);
      },
      'exception payload should have telemetry': function (r) {
        var addItemStub = r.testData.addItemStub;
        var response1 = r.testData.response1;
        var response2 = r.testData.response2;

        assert.isTrue(addItemStub.called);
        var telemetry = addItemStub.getCall(0).args[3].data.body.telemetry;

        // Verify that the responses were received intact.
        assert.deepStrictEqual(response1.headers, testHeaders3);
        assert.deepStrictEqual(response2.headers, testHeaders4);
        assert.deepStrictEqual(response1.statusCode, 200);
        assert.deepStrictEqual(response2.statusCode, 201);

        // Verify telemetry items and order
        assert.deepStrictEqual(telemetry[0].level, 'info');
        assert.deepStrictEqual(telemetry[0].type, 'log');
        assert.deepStrictEqual(
          telemetry[0].body.message,
          'test console message , extra part\n',
        );

        assert.deepStrictEqual(telemetry[1].level, 'info');
        assert.deepStrictEqual(telemetry[1].type, 'network');
        assert.deepStrictEqual(telemetry[1].body.method, 'GET');
        assert.deepStrictEqual(
          telemetry[1].body.url,
          'http://example.com/api/users',
        );
        assert.deepStrictEqual(telemetry[1].body.status_code, 200);
        assert.deepStrictEqual(telemetry[1].body.subtype, 'http');

        assert.deepStrictEqual(telemetry[2].level, 'error');
        assert.deepStrictEqual(telemetry[2].type, 'log');
        assert.deepStrictEqual(
          telemetry[2].body.message,
          'test console error message\n',
        );

        assert.deepStrictEqual(telemetry[3].level, 'info');
        assert.deepStrictEqual(telemetry[3].type, 'network');
        assert.deepStrictEqual(telemetry[3].body.method, 'POST');
        assert.deepStrictEqual(
          telemetry[3].body.url,
          'https://example.com/api/users',
        );
        assert.deepStrictEqual(telemetry[3].body.status_code, 201);
        assert.deepStrictEqual(telemetry[3].body.subtype, 'http');

        // Verify headers are omitted
        assert.deepEqual(telemetry[1].body.request_headers, undefined);
        assert.deepEqual(telemetry[1].body.response.headers, undefined);
        assert.deepEqual(telemetry[3].body.request_headers, undefined);
        assert.deepEqual(telemetry[3].body.response.headers, undefined);

        addItemStub.restore();
      },
    },
  })
  .addBatch({
    'with log and network capture enabled with headers enabled': {
      topic: function () {
        var rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
          autoInstrument: {
            network: true,
            networkResponseHeaders: true,
            networkRequestHeaders: true,
          },
        });
        rollbar.testData = {};
        var notifier = rollbar.client.notifier;
        rollbar.testData.addItemStub = sinon.stub(notifier.queue, 'addItem');
        rollbar.testData.getStub = stubGetWithResponse(
          'https://example.com',
          200,
          testHeaders3,
          testBody1,
        );
        rollbar.testData.postStub = stubPostWithResponse(
          'http://example.com',
          201,
          testHeaders4,
          testBody2,
        );

        var func = async function (callback) {
          // Invoke telemetry events
          console.info(testMessage1, testMessagePart);
          rollbar.testData.response1 = await request(
            https,
            'https://example.com/api/users',
            { method: 'GET', headers: testHeaders1 },
          );
          console.error(testMessage2);
          rollbar.testData.response2 = await request(
            http,
            'http://example.com/api/users',
            { method: 'POST', headers: testHeaders2 },
          );

          await message(rollbar);
          callback(rollbar);
        };
        func(this.callback);
      },
      'message payload should have telemetry': function (r) {
        var addItemStub = r.testData.addItemStub;

        assert.isTrue(addItemStub.called);
        var telemetry = addItemStub.getCall(0).args[3].data.body.telemetry;

        // Verify headers captures, with scrubbing
        assert.deepStrictEqual(telemetry[1].body.request_headers, {
          'Content-Type': 'application/json',
          'X-access-token': '********',
        });
        assert.deepStrictEqual(telemetry[1].body.response.headers, {
          'content-type': 'application/json',
          foo: '123',
        });
        assert.deepStrictEqual(telemetry[3].body.request_headers, {
          authorization: '********',
          foo: '456',
        });
        assert.deepStrictEqual(telemetry[3].body.response.headers, {
          authorization: '********',
          bar: '456',
        });

        addItemStub.restore();
      },
    },
  })
  .addBatch({
    'with telemetry disabled': {
      topic: function () {
        var rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
        });
        rollbar.testData = {};
        var notifier = rollbar.client.notifier;
        rollbar.testData.addItemStub = sinon.stub(notifier.queue, 'addItem');
        rollbar.testData.getStub = stubGetWithResponse(
          'https://example.com',
          200,
          testHeaders3,
          testBody1,
        );
        rollbar.testData.postStub = stubPostWithResponse(
          'https://example.com',
          201,
          testHeaders4,
          testBody2,
        );

        var func = async function (callback) {
          // Invoke telemetry events
          console.info(testMessage1, testMessagePart);
          rollbar.testData.response1 = await request(
            https,
            'https://example.com/api/users',
            { method: 'GET', headers: testHeaders1 },
          );
          console.error(testMessage2);
          rollbar.testData.response2 = await request(
            https,
            'https://example.com/api/users',
            { method: 'POST', headers: testHeaders2 },
          );

          await message(rollbar);
          callback(rollbar);
        };
        func(this.callback);
      },
      'payload should not have telemetry': function (r) {
        var addItemStub = r.testData.addItemStub;

        assert.isTrue(addItemStub.called);
        var telemetry = addItemStub.getCall(0).args[3].data.body.telemetry;

        // Verify telemetry is empty
        assert.deepEqual(telemetry, []);
      },
    },
  })
  .addBatch({
    'with callback request and error response': {
      topic: function () {
        var rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
          autoInstrument: {
            network: true,
            networkResponseHeaders: true,
            networkRequestHeaders: true,
          },
        });
        var notifier = rollbar.client.notifier;
        rollbar.testData = {};
        rollbar.testData.addItemStub = sinon.stub(notifier.queue, 'addItem');

        var func = async function (callback) {
          var options = {
            method: 'GET',
            protocol: 'https:',
            host: 'example.com',
            path: '/api/users',
            headers: testHeaders1,
          };

          // Invoke telemetry events
          console.info(testMessage1, testMessagePart);
          rollbar.testData.getStub = stubGetWithResponse(
            'https://example.com',
            200,
            testHeaders3,
            testBody1,
          );
          rollbar.testData.response1 = await requestWithCallback(
            https,
            options,
          ).catch((e) => e);
          console.error(testMessage2);
          rollbar.testData.errorStub = stubGetWithError('https://example.com');
          rollbar.testData.response2 = await requestWithCallback(
            https,
            options,
          ).catch((e) => e);

          await message(rollbar);
          callback(rollbar);
        };
        func(this.callback);
      },
      'message payload should have telemetry or error info': function (r) {
        var addItemStub = r.testData.addItemStub;
        var response1 = r.testData.response1;
        var response2 = r.testData.response2;

        assert.isTrue(addItemStub.called);
        var telemetry = addItemStub.getCall(0).args[3].data.body.telemetry;

        // Verify that the responses were received intact.
        assert.deepStrictEqual(response1.headers, testHeaders3);
        assert.deepStrictEqual(response1.statusCode, 200);
        assert(response2 instanceof Error);

        // Verify telemetry
        assert.deepStrictEqual(telemetry[1].body.request_headers, {
          'Content-Type': 'application/json',
          'X-access-token': '********',
        });
        assert.deepStrictEqual(telemetry[1].body.response.headers, {
          'content-type': 'application/json',
          foo: '123',
        });
        assert.deepStrictEqual(telemetry[3].body.request_headers, {
          'Content-Type': 'application/json',
          'X-access-token': '********',
        });
        assert.deepStrictEqual(telemetry[3].body.response, undefined);
        assert.deepStrictEqual(telemetry[3].body.status_code, 0);
        assert.deepStrictEqual(telemetry[3].body.error, 'Error: dns error');

        addItemStub.restore();
      },
    },
  })
  .addBatch({
    'while using autoinstrument': {
      topic: function () {
        const optionsUsingStringUrl = mergeOptions(
          'http://example.com/api/users',
          { method: 'GET', headers: testHeaders1 },
        );
        const optionsUsingClassUrl = mergeOptions(
          new URL('http://example.com/api/users'),
          { method: 'GET', headers: testHeaders1 },
        );

        return {
          optionsUsingStringUrl,
          optionsUsingClassUrl,
        };
      },
      'mergeOptions should correctly handle URL and options': function ({
        optionsUsingStringUrl,
        optionsUsingClassUrl,
      }) {
        assert.deepStrictEqual(optionsUsingStringUrl, optionsUsingClassUrl);
      },
    },
  })
  .export(module, { error: false });
