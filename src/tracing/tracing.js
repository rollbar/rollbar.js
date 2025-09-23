import { ContextManager, createContextKey } from './contextManager.js';
import { Session } from './session.js';
import { SpanExporter } from './exporter.js';
import { SpanProcessor } from './spanProcessor.js';
import { Tracer } from './tracer.js';
import id from './id.js';

const SPAN_KEY = createContextKey('Rollbar Context Key SPAN');

export default class Tracing {
  constructor(gWindow, options) {
    this.options = options;
    this.window = gWindow;

    if (this.window.sessionStorage) {
      this.session = new Session(this, options);
    }
    this.createTracer();
  }

  initSession() {
    if (this.session) {
      this.session.init();
    }
  }

  get sessionId() {
    if (this.session) {
      return this.session.session.id;
    }
    return null;
  }

  get resource() {
    return {
      attributes: {
        ...(this.options.resource || {}),
        'rollbar.environment':
          this.options.payload?.environment ?? this.options.environment,
      },
    };
  }

  get scope() {
    return {
      name: 'rollbar-browser-js',
      version: this.options.version,
    };
  }

  idGen(bytes = 16) {
    return id.gen(bytes);
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
    return this.with(
      this.setSpan(this.contextManager.active(), span),
      fn,
      thisArg,
      span,
    );
  }
}
