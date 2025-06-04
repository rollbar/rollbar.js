/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */

import { expect } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import http from 'http';
import https from 'https';
import { URL } from 'url';

import Rollbar from '../src/server/rollbar.js';
import { mergeOptions } from '../src/server/telemetry/urlHelpers.js';

process.env.NODE_ENV = process.env.NODE_ENV || 'test-node-env';

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
    const req = url
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
    const req = transport.request(options, function (res) {
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

const testHeaders1 = {
  'Content-Type': 'application/json',
  'X-access-token': '123',
};
const testHeaders2 = { authorization: 'abc', foo: '456' };
const testHeaders3 = { 'content-type': 'application/json', foo: '123' };
const testHeaders4 = { authorization: 'abc', bar: '456' };
const testBody1 = 'test body 1';
const testBody2 = 'test body 2';
const testMessage1 = 'test console message';
const testMessage2 = 'test console error message';
const testMessagePart = ', extra part';

describe('telemetry', function () {
  describe('with log and network capture enabled', function () {
    let rollbar;
    let addItemStub;
    let response1;
    let response2;
    let mochaHandlers;

    beforeEach(async function () {
      // Remove Mocha's uncaught exception handlers to prevent
      // them from interfering with Rollbar's handlers.
      mochaHandlers = process.listeners('uncaughtException');
      mochaHandlers.forEach((handler) => {
        process.removeListener('uncaughtException', handler);
      });

      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUncaught: true,
        autoInstrument: true,
      });
      const notifier = rollbar.client.notifier;
      addItemStub = sinon.stub(notifier.queue, 'addItem');

      // These are necessary so nock intercepts these HTTP requests
      stubGetWithResponse('http://example.com', 200, testHeaders3, testBody1);
      stubPostWithResponse('https://example.com', 201, testHeaders4, testBody2);

      // Invoke telemetry events
      console.info(testMessage1, testMessagePart);
      response1 = await request(http, 'http://example.com/api/users', {
        method: 'GET',
        headers: testHeaders1,
      });
      console.error(testMessage2);
      response2 = await request(https, 'https://example.com/api/users', {
        method: 'POST',
        headers: testHeaders2,
      });

      await uncaught(rollbar);
    });

    afterEach(function () {
      addItemStub.restore();
      nock.cleanAll();

      // Restore Mocha's uncaught exception handlers
      mochaHandlers.forEach((handler) => {
        process.on('uncaughtException', handler);
      });
    });

    it('exception payload should have telemetry', function () {
      expect(addItemStub.called).to.be.true;
      const telemetry = addItemStub.getCall(0).args[3].data.body.telemetry;

      // Verify that the responses were received intact.
      expect(response1.headers).to.deep.equal(testHeaders3);
      expect(response2.headers).to.deep.equal(testHeaders4);
      expect(response1.statusCode).to.equal(200);
      expect(response2.statusCode).to.equal(201);

      // Verify telemetry items and order
      expect(telemetry[0].level).to.equal('info');
      expect(telemetry[0].type).to.equal('log');
      expect(telemetry[0].body.message).to.equal(
        'test console message , extra part\n',
      );

      expect(telemetry[1].level).to.equal('info');
      expect(telemetry[1].type).to.equal('network');
      expect(telemetry[1].body.method).to.equal('GET');
      expect(telemetry[1].body.url).to.equal('http://example.com/api/users');
      expect(telemetry[1].body.status_code).to.equal(200);
      expect(telemetry[1].body.subtype).to.equal('http');

      expect(telemetry[2].level).to.equal('error');
      expect(telemetry[2].type).to.equal('log');
      expect(telemetry[2].body.message).to.equal(
        'test console error message\n',
      );

      expect(telemetry[3].level).to.equal('info');
      expect(telemetry[3].type).to.equal('network');
      expect(telemetry[3].body.method).to.equal('POST');
      expect(telemetry[3].body.url).to.equal('https://example.com/api/users');
      expect(telemetry[3].body.status_code).to.equal(201);
      expect(telemetry[3].body.subtype).to.equal('http');

      // Verify headers are omitted
      expect(telemetry[1].body.request_headers).to.be.undefined;
      expect(telemetry[1].body.response.headers).to.be.undefined;
      expect(telemetry[3].body.request_headers).to.be.undefined;
      expect(telemetry[3].body.response.headers).to.be.undefined;
    });
  });

  describe('with log and network capture enabled with headers enabled', function () {
    let rollbar;
    let addItemStub;

    beforeEach(async function () {
      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUncaught: true,
        autoInstrument: {
          network: true,
          networkResponseHeaders: true,
          networkRequestHeaders: true,
        },
      });
      const notifier = rollbar.client.notifier;
      addItemStub = sinon.stub(notifier.queue, 'addItem');
      stubGetWithResponse('https://example.com', 200, testHeaders3, testBody1);
      stubPostWithResponse('http://example.com', 201, testHeaders4, testBody2);

      // Invoke telemetry events
      console.info(testMessage1, testMessagePart);
      await request(https, 'https://example.com/api/users', {
        method: 'GET',
        headers: testHeaders1,
      });
      console.error(testMessage2);
      await request(http, 'http://example.com/api/users', {
        method: 'POST',
        headers: testHeaders2,
      });

      await message(rollbar);
    });

    afterEach(function () {
      addItemStub.restore();
      nock.cleanAll();
    });

    it('message payload should have telemetry', function () {
      expect(addItemStub.called).to.be.true;
      const telemetry = addItemStub.getCall(0).args[3].data.body.telemetry;

      // Verify headers captures, with scrubbing
      expect(telemetry[1].body.request_headers).to.deep.equal({
        'Content-Type': 'application/json',
        'X-access-token': '********',
      });
      expect(telemetry[1].body.response.headers).to.deep.equal({
        'content-type': 'application/json',
        foo: '123',
      });
      expect(telemetry[3].body.request_headers).to.deep.equal({
        authorization: '********',
        foo: '456',
      });
      expect(telemetry[3].body.response.headers).to.deep.equal({
        authorization: '********',
        bar: '456',
      });
    });
  });

  describe('with telemetry disabled', function () {
    let rollbar;
    let addItemStub;

    beforeEach(async function () {
      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUncaught: true,
      });
      const notifier = rollbar.client.notifier;
      addItemStub = sinon.stub(notifier.queue, 'addItem');
      stubGetWithResponse('https://example.com', 200, testHeaders3, testBody1);
      stubPostWithResponse('https://example.com', 201, testHeaders4, testBody2);

      // Invoke telemetry events
      console.info(testMessage1, testMessagePart);
      await request(https, 'https://example.com/api/users', {
        method: 'GET',
        headers: testHeaders1,
      });
      console.error(testMessage2);
      await request(https, 'https://example.com/api/users', {
        method: 'POST',
        headers: testHeaders2,
      });

      await message(rollbar);
    });

    afterEach(function () {
      addItemStub.restore();
      nock.cleanAll();
    });

    it('payload should not have telemetry', function () {
      expect(addItemStub.called).to.be.true;
      const telemetry = addItemStub.getCall(0).args[3].data.body.telemetry;

      // Verify telemetry is empty
      expect(telemetry).to.deep.equal([]);
    });
  });

  describe('with callback request and error response', function () {
    let rollbar;
    let addItemStub;
    let response1;
    let response2;

    beforeEach(async function () {
      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUncaught: true,
        autoInstrument: {
          network: true,
          networkResponseHeaders: true,
          networkRequestHeaders: true,
        },
      });
      const notifier = rollbar.client.notifier;
      addItemStub = sinon.stub(notifier.queue, 'addItem');

      const options = {
        method: 'GET',
        protocol: 'https:',
        host: 'example.com',
        path: '/api/users',
        headers: testHeaders1,
      };

      // Invoke telemetry events
      console.info(testMessage1, testMessagePart);
      stubGetWithResponse('https://example.com', 200, testHeaders3, testBody1);
      response1 = await requestWithCallback(https, options).catch((e) => e);
      console.error(testMessage2);
      stubGetWithError('https://example.com');
      response2 = await requestWithCallback(https, options).catch((e) => e);

      await message(rollbar);
    });

    afterEach(function () {
      addItemStub.restore();
      nock.cleanAll();
    });

    it('message payload should have telemetry or error info', function () {
      expect(addItemStub.called).to.be.true;
      const telemetry = addItemStub.getCall(0).args[3].data.body.telemetry;

      // Verify that the responses were received intact.
      expect(response1.headers).to.deep.equal(testHeaders3);
      expect(response1.statusCode).to.equal(200);
      expect(response2).to.be.instanceof(Error);

      // Verify telemetry
      expect(telemetry[1].body.request_headers).to.deep.equal({
        'Content-Type': 'application/json',
        'X-access-token': '********',
      });
      expect(telemetry[1].body.response.headers).to.deep.equal({
        'content-type': 'application/json',
        foo: '123',
      });
      expect(telemetry[3].body.request_headers).to.deep.equal({
        'Content-Type': 'application/json',
        'X-access-token': '********',
      });
      expect(telemetry[3].body.response).to.be.undefined;
      expect(telemetry[3].body.status_code).to.equal(0);
      expect(telemetry[3].body.error).to.equal('Error: dns error');
    });
  });

  describe('while using autoinstrument', function () {
    it('mergeOptions should correctly handle URL and options', function () {
      const optionsUsingStringUrl = mergeOptions(
        'http://example.com/api/users',
        { method: 'GET', headers: testHeaders1 },
      );
      const optionsUsingClassUrl = mergeOptions(
        new URL('http://example.com/api/users'),
        { method: 'GET', headers: testHeaders1 },
      );

      expect(optionsUsingStringUrl).to.deep.equal(optionsUsingClassUrl);
    });
  });
});
