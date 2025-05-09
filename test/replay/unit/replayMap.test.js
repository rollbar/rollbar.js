/**
 * Unit tests for the ReplayMap module
 */

/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */
/* globals sinon */

import { expect } from 'chai';
import sinon from 'sinon';
import ReplayMap from '../../../src/browser/replay/replayMap.js';

// Mock objects for testing
class MockSpan {
  constructor() {
    this.setAttribute = sinon.stub();
    this.span = { name: 'test-span' };
  }
}

class MockRecorder {
  constructor(returnSpan = true) {
    this.span = returnSpan ? new MockSpan() : null;
    this.dump = sinon.stub().returns(this.span);
  }
}

class MockExporter {
  constructor() {
    this.spans = [{ id: 'span1' }, { id: 'span2' }];
    this.export = sinon.stub().returns(this.spans);
  }
}

class MockApi {
  constructor() {
    this.postSpans = sinon.stub();
    // Default success response
    this.postSpans.resolves({ success: true });
  }
}

class MockTracing {
  constructor() {
    this.contextObj = { active: sinon.stub().returns('activeContext') };
    this.context = sinon.stub().returns(this.contextObj);
    this.hexId = sinon.stub().returns('1234567890abcdef');
  }
}

describe('ReplayMap', function() {
  let replayMap;
  let mockRecorder;
  let mockExporter;
  let mockApi;
  let mockTracing;
  
  beforeEach(function() {
    mockRecorder = new MockRecorder();
    mockExporter = new MockExporter();
    mockApi = new MockApi();
    mockTracing = new MockTracing();
    
    replayMap = new ReplayMap({
      recorder: mockRecorder,
      exporter: mockExporter,
      api: mockApi,
      tracing: mockTracing
    });
  });
  
  afterEach(function() {
    sinon.restore();
  });
  
  describe('constructor', function() {
    it('should throw when required dependencies are missing', function() {
      expect(() => new ReplayMap({})).to.throw(TypeError);
      expect(() => new ReplayMap({ recorder: mockRecorder })).to.throw(TypeError);
      expect(() => new ReplayMap({ recorder: mockRecorder, exporter: mockExporter })).to.throw(TypeError);
      expect(() => new ReplayMap({ 
        recorder: mockRecorder, 
        exporter: mockExporter, 
        api: mockApi
      })).to.throw(TypeError);
      
      // Should not throw with all dependencies
      expect(() => new ReplayMap({
        recorder: mockRecorder,
        exporter: mockExporter,
        api: mockApi,
        tracing: mockTracing
      })).to.not.throw();
    });
  });
  
  describe('_processReplay', function() {
    it('should dump recording and add spans to the map', async function() {
      const replayId = '1234567890abcdef';
      const result = await replayMap._processReplay(replayId);
      
      expect(result).to.be.true;
      expect(mockTracing.context.called).to.be.true;
      expect(mockTracing.contextObj.active.called).to.be.true;
      expect(mockRecorder.dump.called).to.be.true;
      expect(mockRecorder.span.setAttribute.calledWith('rollbar.replay.id', replayId)).to.be.true;
      expect(mockExporter.export.called).to.be.true;
      
      // Check if the spans are stored in the map with the replayId
      // Using the private map through the size getter
      expect(replayMap.size).to.equal(1);
    });
    
    it('should return false if no recording span is created', async function() {
      // Use recorder that returns null from dump
      mockRecorder = new MockRecorder(false);
      replayMap = new ReplayMap({
        recorder: mockRecorder,
        exporter: mockExporter,
        api: mockApi,
        tracing: mockTracing
      });
      
      const replayId = '1234567890abcdef';
      const result = await replayMap._processReplay(replayId);
      
      expect(result).to.be.false;
      expect(mockRecorder.dump.called).to.be.true;
      expect(mockExporter.export.called).to.be.false;
      
      // Nothing should have been added to the map
      expect(replayMap.size).to.equal(0);
    });
    
    it('should handle errors gracefully and return false', async function() {
      mockRecorder.dump.throws(new Error('Test error'));
      
      const replayId = '1234567890abcdef';
      const result = await replayMap._processReplay(replayId);
      
      expect(result).to.be.false;
      expect(mockRecorder.dump.called).to.be.true;
      
      // Nothing should have been added to the map
      expect(replayMap.size).to.equal(0);
    });
  });
  
  describe('add', function() {
    it('should generate a replayId and initiate async processing', function() {
      // Stub _processReplay to avoid actual processing
      const processStub = sinon.stub(replayMap, '_processReplay').resolves(true);
      
      const replayId = replayMap.add();
      
      expect(replayId).to.equal('1234567890abcdef');
      expect(mockTracing.hexId.calledWith(8)).to.be.true;
      expect(processStub.calledWith(replayId)).to.be.true;
    });
    
    it('should handle errors from _processReplay', function(done) {
      // Make _processReplay reject
      sinon.stub(replayMap, '_processReplay').rejects(new Error('Test error'));
      
      // Create console.error spy
      const errorSpy = sinon.spy(console, 'error');
      
      // Should not throw despite the rejection
      try {
        replayMap.add();
        
        // Wait for the async operation to complete
        setTimeout(() => {
          expect(errorSpy.called).to.be.true;
          expect(errorSpy.args[0][0]).to.include('Failed to process replay');
          done();
        }, 0);
      } catch (error) {
        done(error);
      }
    });
  });
  
  describe('send', function() {
    it('should send spans and remove them from the map', async function() {
      // Add a mock replay to the map
      await replayMap._processReplay('testReplayId');
      expect(replayMap.size).to.equal(1);
      
      const result = await replayMap.send('testReplayId');
      
      expect(result).to.be.true;
      expect(mockApi.postSpans.called).to.be.true;
      expect(mockApi.postSpans.firstCall.args[0]).to.deep.equal(mockExporter.spans);
      
      // Map should be empty after sending
      expect(replayMap.size).to.equal(0);
    });
    
    it('should handle missing replayId parameter', async function() {
      const consoleSpy = sinon.spy(console, 'warn');
      
      const result = await replayMap.send();
      
      expect(result).to.be.false;
      expect(consoleSpy.calledWith('ReplayMap.send: No replayId provided')).to.be.true;
      expect(mockApi.postSpans.called).to.be.false;
    });
    
    it('should handle non-existent replayId', async function() {
      const consoleSpy = sinon.spy(console, 'warn');
      
      const result = await replayMap.send('nonexistent');
      
      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('No replay found for replayId');
      expect(mockApi.postSpans.called).to.be.false;
    });
    
    it('should handle empty spans array', async function() {
      replayMap.setSpans('emptyReplayId', []);
      
      const consoleSpy = sinon.spy(console, 'warn');
      const result = await replayMap.send('emptyReplayId');
      
      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('No spans found for replayId');
      expect(mockApi.postSpans.called).to.be.false;
    });
    
    it('should handle API errors during sending', async function() {
      // Add a mock replay to the map
      await replayMap._processReplay('errorReplayId');
      
      // Make API throw error
      mockApi.postSpans.rejects(new Error('API error'));
      
      const consoleSpy = sinon.spy(console, 'error');
      const result = await replayMap.send('errorReplayId');
      
      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('Error sending replay');
      expect(mockApi.postSpans.called).to.be.true;
      
      // Should still remove from map even on error
      expect(replayMap.size).to.equal(0);
    });
  });
  
  describe('discard', function() {
    it('should remove the replay from the map without sending', async function() {
      // Add a mock replay to the map
      await replayMap._processReplay('discardReplayId');
      expect(replayMap.size).to.equal(1);
      
      const result = replayMap.discard('discardReplayId');
      
      expect(result).to.be.true;
      expect(mockApi.postSpans.called).to.be.false;
      expect(replayMap.size).to.equal(0);
    });
    
    it('should handle missing replayId parameter', function() {
      const consoleSpy = sinon.spy(console, 'warn');
      
      const result = replayMap.discard();
      
      expect(result).to.be.false;
      expect(consoleSpy.calledWith('ReplayMap.discard: No replayId provided')).to.be.true;
    });
    
    it('should handle non-existent replayId', function() {
      const consoleSpy = sinon.spy(console, 'warn');
      
      const result = replayMap.discard('nonexistent');
      
      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('No replay found for replayId');
    });
  });
  
  describe('getSpans and setSpans', function() {
    it('should get spans correctly when they exist', function() {
      const testSpans = [{ id: 'testSpan1' }, { id: 'testSpan2' }];
      replayMap.setSpans('testReplayId', testSpans);
      
      const result = replayMap.getSpans('testReplayId');
      expect(result).to.deep.equal(testSpans);
    });
    
    it('should return null when getting spans for non-existent replayId', function() {
      const result = replayMap.getSpans('nonExistentId');
      expect(result).to.be.null;
    });
    
    it('should allow overwriting existing spans', function() {
      const initialSpans = [{ id: 'initialSpan' }];
      const updatedSpans = [{ id: 'updatedSpan' }];
      
      replayMap.setSpans('replayId', initialSpans);
      expect(replayMap.getSpans('replayId')).to.deep.equal(initialSpans);
      
      replayMap.setSpans('replayId', updatedSpans);
      expect(replayMap.getSpans('replayId')).to.deep.equal(updatedSpans);
    });
  });
  
  describe('size and clear', function() {
    it('should report correct size of the map', async function() {
      expect(replayMap.size).to.equal(0);
      
      await replayMap._processReplay('id1');
      expect(replayMap.size).to.equal(1);
      
      await replayMap._processReplay('id2');
      expect(replayMap.size).to.equal(2);
    });
    
    it('should clear all entries from the map', async function() {
      await replayMap._processReplay('id1');
      await replayMap._processReplay('id2');
      expect(replayMap.size).to.equal(2);
      
      replayMap.clear();
      expect(replayMap.size).to.equal(0);
    });
  });
});