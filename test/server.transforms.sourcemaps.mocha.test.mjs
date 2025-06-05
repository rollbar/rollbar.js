/* globals describe */
/* globals it */

import { expect } from 'chai';
import sinon from 'sinon';
import Rollbar from '../src/server/rollbar.js';
import { throwInScriptFile } from './server.transforms.test-utils.mjs';

describe('transforms.nodeSourceMaps', function () {
  let rollbar;
  let addItemStub;
  let mochaHandlers;

  before(function () {
    // Increase max listeners to avoid warnings during tests
    // Multiple Rollbar instances are created and each adds handlers
    process.setMaxListeners(20);
  });

  after(function () {
    process.setMaxListeners(10);
  });

  beforeEach(function () {
    // Remove Mocha's uncaught exception handlers to prevent interference
    mochaHandlers = process.listeners('uncaughtException');
    mochaHandlers.forEach((handler) => {
      process.removeListener('uncaughtException', handler);
    });

    rollbar = new Rollbar({
      accessToken: 'abc123',
      captureUncaught: true,
      nodeSourceMaps: true,
    });

    addItemStub = sinon.stub(rollbar.client.notifier.queue, 'addItem');
  });

  afterEach(function () {
    addItemStub.restore();

    // Restore Mocha's handlers
    mochaHandlers.forEach((handler) => {
      process.on('uncaughtException', handler);
    });
  });

  it('should map the stack with context when original source is present', async function () {
    await throwInScriptFile('../examples/node-typescript/dist/index.js');

    expect(addItemStub.called).to.be.true;

    const frame = addItemStub
      .getCall(0)
      .args[0].body.trace_chain[0].frames.pop();

    expect(frame.filename).to.include('src/index.ts');
    expect(frame.lineno).to.equal(10);
    expect(frame.colno).to.equal(22);
    expect(frame.code).to.equal(
      "  var error = <Error> new CustomError('foo');",
    );
    expect(frame.context.pre[0]).to.equal('    }');
    expect(frame.context.pre[1]).to.equal('  }');
    expect(frame.context.pre[2]).to.equal(
      '  // TypeScript code snippet will include `<Error>`',
    );
    expect(frame.context.post[0]).to.equal('  throw error;');
    expect(frame.context.post[1]).to.equal('}');

    const sourceMappingURLs =
      addItemStub.getCall(0).args[0].notifier.diagnostic.node_source_maps
        .source_mapping_urls;
    const urls = Object.keys(sourceMappingURLs);

    expect(urls[0]).to.include('index.js');
    expect(sourceMappingURLs[urls[0]]).to.include('index.js.map');
    expect(urls[1]).to.include('server.transforms.test-utils.mjs');
    expect(sourceMappingURLs[urls[1]]).to.include('not found');

    // Node until v12 will have 'timers.js' here.
    // Node 12 - 14 will have 'internal/timers.js' here.
    // Starting in v16, this is 'node:internal/timers'.
    // This assert works for all and is specific enough for this test case.
    expect(urls[2]).to.include('timers');
    expect(sourceMappingURLs[urls[2]]).to.include('not found');
  });

  it('should map the stack with context using sourcesContent', async function () {
    await throwInScriptFile('../examples/node-dist/index.js');

    expect(addItemStub.called).to.be.true;

    const frame = addItemStub
      .getCall(0)
      .args[0].body.trace_chain[0].frames.pop();

    expect(frame.filename).to.include('src/index.ts');
    expect(frame.lineno).to.equal(10);
    expect(frame.colno).to.equal(22);
    expect(frame.code).to.equal(
      "  var error = <Error> new CustomError('foo');",
    );
    expect(frame.context.pre[0]).to.equal('    }');
    expect(frame.context.pre[1]).to.equal('  }');
    expect(frame.context.pre[2]).to.equal(
      '  // TypeScript code snippet will include `<Error>`',
    );
    expect(frame.context.post[0]).to.equal('  throw error;');
    expect(frame.context.post[1]).to.equal('}');

    const sourceMappingURLs =
      addItemStub.getCall(0).args[0].notifier.diagnostic.node_source_maps
        .source_mapping_urls;
    const urls = Object.keys(sourceMappingURLs);

    expect(urls).to.have.lengthOf(1);
    expect(urls[0]).to.include('index.js');
    expect(sourceMappingURLs[urls[0]]).to.include('index.js.map');
  });
});
