export class Context {
  constructor(parentContext) {
    this._currentContext = parentContext ? new Map(parentContext) : new Map();
  }

  getValue(key) {
    return this._currentContext.get(key);
  }

  setValue(key, value) {
    const context = new Context(this._currentContext);
    context._currentContext.set(key, value);
    return context;
  }

  deleteValue(key) {
    const context = new Context(self._currentContext);
    context._currentContext.delete(key);
    return context;
  }
}

export const ROOT_CONTEXT = new Context();
