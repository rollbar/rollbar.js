import { ROOT_CONTEXT } from './context.js';

export class ContextManager {
  constructor() {
    this.currentContext = ROOT_CONTEXT;
  }

  active() {
    return this.currentContext;
  }

  startSpan(context) {
    const previousContext = this.currentContext;
    this.currentContext = context || ROOT_CONTEXT;
    return previousContext;
  }

  endSpan(context) {
    this.currentContext = context;
    return this.currentContext;
  }

  with(context, fn, thisArg, ...args) {
    const previousContext = this.startSpan(context);
    try {
      return fn.call(thisArg, ...args);
    } finally {
      this.endSpan(previousContext);
    }
  }
}

export function createContextKey(key) {
  // Use Symbol for OpenTelemetry compatibility.
  return Symbol.for(key);
}

