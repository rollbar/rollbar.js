import { expect } from 'chai';

import {
  ContextManager,
  createContextKey,
} from '../../src/tracing/contextManager.js';
import { ROOT_CONTEXT } from '../../src/tracing/context.js';

describe('ContextManager()', function () {
  it('should process pending spans', function (done) {
    const SPAN_KEY = createContextKey('Rollbar Context Key SPAN');
    const contextManager = new ContextManager();

    expect(contextManager.active()).to.equal(ROOT_CONTEXT);

    let context = contextManager.active().setValue(SPAN_KEY, 'a');
    let prevContext = contextManager.enterContext(context);

    expect(prevContext).to.equal(ROOT_CONTEXT);
    expect(contextManager.active()).to.equal(context);

    contextManager.exitContext(prevContext);

    expect(contextManager.active()).to.equal(ROOT_CONTEXT);

    done();
  });
});
