/**
 * Unit tests for the postSpans method in the API module
 */


import { expect } from 'chai';
import sinon from 'sinon';
import Api from '../../../src/api.js';

describe('Api', function () {
  let api;
  let transport;
  let mockUrl;

  beforeEach(function () {
    transport = {
      post: sinon
        .stub()
        .callsFake(({accessToken, options, payload, callback}) => {
          callback(null, { result: 'ok' });
        }),
      postJsonPayload: sinon.stub(),
    };

    mockUrl = {
      parse: sinon.stub().returns({
        hostname: 'api.rollbar.com',
        protocol: 'https:',
        port: 443,
        pathname: '/api/1/item/',
        search: null,
      }),
    };

    api = new Api(
      { accessToken: 'test_token' },
      transport,
      mockUrl,
      null, // truncation
    );
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('postSpans', function () {
    it('should create proper transport options for session endpoint', async function () {
      const spans = [{ id: 'span1' }];
      await api.postSpans(spans);

      expect(transport.post.called).to.be.true;

      const options = transport.post.firstCall.args[0].options;
      expect(options.path).to.include('/session/');
      expect(options.method).to.equal('POST');
    });

    it('should create a payload with resourceSpans', async function () {
      const spans = { resourceSpans: [{ id: 'span1' }] };
      await api.postSpans(spans);

      expect(transport.post.called).to.be.true;

      const payload = transport.post.firstCall.args[0].payload;
      expect(payload).to.have.property('resourceSpans');
      expect(payload).to.deep.equal(spans);
    });

    it('should return a promise that resolves with the response', async function () {
      const spans = [{ id: 'span1' }];
      const expectedResponse = { result: 'ok' };

      const result = await api.postSpans(spans);
      expect(result).to.deep.equal(expectedResponse);
    });

    it('should handle transport errors', async function () {
      const spans = [{ id: 'span1' }];
      const expectedError = new Error('Transport error');

      transport.post.callsFake(({accessToken, options, payload, callback}) => {
        callback(expectedError);
      });

      try {
        await api.postSpans(spans);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.equal(expectedError);
      }
    });

    it('should use the provided access token', async function () {
      const spans = [{ id: 'span1' }];
      await api.postSpans(spans);

      expect(transport.post.called).to.be.true;
      const accessToken = transport.post.firstCall.args[0].accessToken;
      expect(accessToken).to.equal('test_token');
    });

    it('should update transport options when API is reconfigured', async function () {
      await api.postSpans([{ id: 'span1' }]);

      api.configure({
        endpoint: 'https://custom.rollbar.com/api/1/session/',
      });

      await api.postSpans([{ id: 'span2' }]);

      expect(transport.post.callCount).to.equal(2);

      const optionsAfterConfig = transport.post.secondCall.args[0].options;
      expect(optionsAfterConfig.hostname).to.equal('api.rollbar.com');
    });
  });

  describe('_postPromise', function () {
    it('should resolve with response when transport succeeds', async function () {
      const expectedResponse = { success: true };
      transport.post.callsFake(({accessToken, options, payload, callback}) => {
        callback(null, expectedResponse);
      });

      const result = await api._postPromise('token', {}, {});
      expect(result).to.deep.equal(expectedResponse);
    });

    it('should reject with error when transport fails', async function () {
      const expectedError = new Error('Transport error');
      transport.post.callsFake(({accessToken, options, payload, callback}) => {
        callback(expectedError);
      });

      try {
        await api._postPromise('token', {}, {});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.equal(expectedError);
      }
    });
  });
});
