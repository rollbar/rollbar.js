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

  init(attrs = {}) {
    if (this.session) {
      return this;
    }
    this.getSession() || this.createSession();

    this.initSessionAttributes(attrs);

    return this;
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

  setUser(user) {
    this.setAttributes({
      'user.id': user?.id,
      'user.email': user?.email,
      'user.name': user?.name || user?.username,
    });
    return this;
  }

  initSessionAttributes(attrs) {
    this.setAttributes({
      'session.id': this.session.id,
      'browser.brands': navigator.userAgentData?.brands,
      'browser.language': navigator.language,
      'browser.mobile': navigator.userAgentData?.mobile,
      'browser.platform': navigator.userAgentData?.platform,
      'client.address': '$remote_ip', // updated at the API
      'rollbar.notifier.framework': 'browser-js',
      'user_agent.original': navigator.userAgent,
      ...attrs,
    });
    return this;
  }
}
