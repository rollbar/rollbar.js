/**
 * API integration tests for span transport
 */


import { expect } from 'chai';
import sinon from 'sinon';

import Api from '../../../src/api.js';
import {
  standardPayload,
  createPayloadWithReplayId,
} from '../../fixtures/replay/payloads.fixtures.js';

describe('API Span Transport', function () {
  let api;
  let transport;
  let accessToken;

  beforeEach(function () {
    accessToken = 'test-token-12345';

    transport = {
      post: sinon
        .stub()
        .callsFake(({accessToken, options, payload, callback}) => {
          setTimeout(() => {
            callback(null, { err: 0, result: { id: '12345' } });
          }, 10);
        }),
      postJsonPayload: sinon.stub(),
    };

    const urlMock = { parse: sinon.stub().returns({}) };
    const truncationMock = {
      truncate: sinon.stub().returns({ error: null, value: '{}' }),
    };

    api = new Api({ accessToken }, transport, urlMock, truncationMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should use the session endpoint for spans', async function () {
    const spans = standardPayload;

    await api.postSpans(spans);

    expect(transport.post.calledOnce).to.be.true;

    const options = transport.post.firstCall.args[0].options;
    expect(options.path).to.include('/api/1/session/');
  });

  it('should format spans payload correctly', async function () {
    const testReplayId = 'test-replay-api-12345';
    const spans = createPayloadWithReplayId(testReplayId);

    await api.postSpans(spans);

    const payload = transport.post.firstCall.args[0].payload;

    expect(payload).to.have.property('resourceSpans');
    expect(payload).to.deep.equal(spans);
  });

  it('should handle transport errors', async function () {
    const testError = new Error('Transport failure');
    transport.post.callsFake(
      ({accessToken, options, payload, callback}) => {
        setTimeout(() => {
          callback(testError);
        }, 10);
      },
    );

    const spans = [{ id: 'error-span', name: 'error-recording' }];

    try {
      await api.postSpans(spans);
      expect.fail('Expected error not thrown');
    } catch (error) {
      expect(error).to.equal(testError);
    }
  });

  it('should handle API response errors', async function () {
    transport.post.callsFake(
      ({accessToken, options, payload, callback}) => {
        setTimeout(() => {
          callback(null, { err: 1, message: 'API Error' });
        }, 10);
      },
    );

    const spans = [{ id: 'error-span', name: 'error-recording' }];

    const response = await api.postSpans(spans);

    expect(response).to.have.property('err', 1);
    expect(response).to.have.property('message', 'API Error');
  });

  it('should merge options when reconfigured', function () {
    const originalOptions = api.options;

    api.configure({
      endpoint: 'https://custom.rollbar.com/api/',
    });

    expect(api.options).to.not.equal(originalOptions);
    expect(api.options).to.have.property(
      'endpoint',
      'https://custom.rollbar.com/api/',
    );
    expect(api.accessToken).to.equal(accessToken);
  });

  it('should update sessionTransportOptions when reconfigured', function () {
    const originalTransportOptions = api.OTLPTransportOptions;

    api.configure({
      tracing: {
        endpoint: 'https://custom.rollbar.com/api/',
      },
    });

    expect(api.OTLPTransportOptions).to.not.equal(originalTransportOptions);
  });
});
