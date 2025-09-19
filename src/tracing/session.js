import id from './id.js';

const SESSION_KEY = 'RollbarSession';

export class Session {
  _attributes;

  constructor(tracing, options) {
    this.options = options;
    this.tracing = tracing;
    this.window = tracing.window;
    this.session = null;
    this._attributes = {};
  }

  init() {
    if (this.session) {
      return this;
    }
    return this.getSession() || this.createSession();
  }

  getSession() {
    try {
      const serializedSession = this.window.sessionStorage.getItem(SESSION_KEY);

      if (!serializedSession) {
        return null;
      }

      this.session = JSON.parse(serializedSession);
    } catch {
      return null;
    }
    return this;
  }

  createSession() {
    this.session = {
      id: id.gen(),
      createdAt: Date.now(),
    };

    return this.setSession(this.session);
  }

  setSession(session) {
    const sessionString = JSON.stringify(session);

    try {
      this.window.sessionStorage.setItem(SESSION_KEY, sessionString);
    } catch {
      return null;
    }
    return this;
  }

  get attributes() {
    return this._attributes;
  }

  setAttributes(attributes) {
    this._attributes = { ...this._attributes, ...attributes };
    return this;
  }
}
