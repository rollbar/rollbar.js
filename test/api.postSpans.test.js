/**
 * Unit tests for the postSpans method in the API module
 */

/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */
/* globals sinon */

import { expect } from 'chai';
import sinon from 'sinon';

// We need to use require since the API module is a CommonJS module
const Api = require('../src/api');

describe('Api', function() {
  let api;
  let transport;
  let mockUrl;
  
  beforeEach(function() {
    // Create mock transport
    transport = {
      post: sinon.stub().callsFake((accessToken, options, payload, callback) => {
        callback(null, { result: 'ok' });
      }),
      postJsonPayload: sinon.stub()
    };
    
    // Create mock URL module
    mockUrl = {
      parse: sinon.stub().returns({
        hostname: 'api.rollbar.com',
        protocol: 'https:',
        port: 443,
        pathname: '/api/1/item/',
        search: null
      })
    };
    
    // Create API instance
    api = new Api(
      { accessToken: 'test_token' },
      transport,
      mockUrl,
      null, // truncation
      null  // jsonBackup
    );
  });
  
  afterEach(function() {
    sinon.restore();
  });
  
  describe('postSpans', function() {
    it('should create proper transport options for session endpoint', async function() {
      const spans = [{ id: 'span1' }];
      await api.postSpans(spans);
      
      expect(transport.post.called).to.be.true;
      
      // Get the options argument (second parameter)
      const options = transport.post.firstCall.args[1];
      expect(options.path).to.include('/session/');
      expect(options.method).to.equal('POST');
    });
    
    it('should create a payload with resourceSpans', async function() {
      const spans = [{ id: 'span1' }];
      await api.postSpans(spans);
      
      expect(transport.post.called).to.be.true;
      
      // Get the payload argument (third parameter)
      const payload = transport.post.firstCall.args[2];
      expect(payload).to.have.property('access_token', 'test_token');
      expect(payload).to.have.property('data');
      expect(payload.data).to.have.property('resourceSpans');
      expect(payload.data.resourceSpans).to.deep.equal(spans);
    });
    
    it('should return a promise that resolves with the response', async function() {
      const spans = [{ id: 'span1' }];
      const expectedResponse = { result: 'ok' };
      
      const result = await api.postSpans(spans);
      expect(result).to.deep.equal(expectedResponse);
    });
    
    it('should handle transport errors', async function() {
      const spans = [{ id: 'span1' }];
      const expectedError = new Error('Transport error');
      
      // Make transport.post fail
      transport.post.callsFake((accessToken, options, payload, callback) => {
        callback(expectedError);
      });
      
      try {
        await api.postSpans(spans);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.equal(expectedError);
      }
    });
    
    it('should use the provided access token', async function() {
      const spans = [{ id: 'span1' }];
      await api.postSpans(spans);
      
      expect(transport.post.called).to.be.true;
      const accessToken = transport.post.firstCall.args[0];
      expect(accessToken).to.equal('test_token');
    });
    
    it('should update transport options when API is reconfigured', async function() {
      // First request with default options
      await api.postSpans([{ id: 'span1' }]);
      
      // Reconfigure the API with a new endpoint
      api.configure({
        endpoint: 'https://custom.rollbar.com/api/1/session/'
      });
      
      // Send another request with new configuration
      await api.postSpans([{ id: 'span2' }]);
      
      expect(transport.post.callCount).to.equal(2);
      
      // Get the options from the second call
      const optionsAfterConfig = transport.post.secondCall.args[1];
      expect(optionsAfterConfig.hostname).to.equal('api.rollbar.com');
    });
  });
  
  describe('_postPromise', function() {
    it('should resolve with response when transport succeeds', async function() {
      const expectedResponse = { success: true };
      transport.post.callsFake((accessToken, options, payload, callback) => {
        callback(null, expectedResponse);
      });
      
      const result = await api._postPromise('token', {}, {});
      expect(result).to.deep.equal(expectedResponse);
    });
    
    it('should reject with error when transport fails', async function() {
      const expectedError = new Error('Transport error');
      transport.post.callsFake((accessToken, options, payload, callback) => {
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