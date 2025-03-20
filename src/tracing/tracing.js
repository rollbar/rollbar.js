import { ContextManager, createContextKey } from './contextManager.js';
import { Session } from './session.js';
import { SpanExporter } from './exporter.js';
import { SpanProcessor } from './spanProcessor.js';
import { Tracer } from './tracer.js';

const SPAN_KEY = createContextKey('Rollbar Context Key SPAN');

export default class Tracing {
  constructor(gWindow, options) {
    this.options = options;
    this.resource = options.resource;
    this.scope = options.notifier;
    this.window = gWindow;

    this.session = new Session(this, options);
    this.createTracer();
  }

  initSession() {
    if (this.session) {
      this.session.init();
    }
  }

  createTracer() {
    this.contextManager = new ContextManager();
    this.exporter = new SpanExporter();
    this.spanProcessor = new SpanProcessor(this.exporter);
    this.tracer = new Tracer(this, this.spanProcessor);
  }

  getTracer() {
    return this.tracer;
  }

  getSpan(context = this.contextManager.active()) {
    return context.getValue(SPAN_KEY);
  }

  setSpan(context = this.contextManager.active(), span) {
    return context.setValue(SPAN_KEY, span);
  }

  startSpan(name, options = {}, context = this.contextManager.active()) {
    return this.tracer.startSpan(name, options, context);
  }

  with(context, fn, thisArg, ...args) {
    return this.contextManager.with(context, fn, thisArg, ...args);
  }

  withSpan(name, options, fn, thisArg) {
    const span = this.startSpan(name, options);
    return this.with(this.setSpan(this.contextManager.active(), span), fn, thisArg, span);
  }

  hexId(bytes = 16) {
    let randomBytes = new Uint8Array(bytes);
    crypto.getRandomValues(randomBytes);
    let randHex = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return randHex;
  }
}
