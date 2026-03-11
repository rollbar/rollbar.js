import { AsyncLocalStorage } from 'node:async_hooks';

export function extractSessionId(headerValue) {
  if (!headerValue) {
    return null;
  }
  const rawValue = Array.isArray(headerValue)
    ? headerValue.join(',')
    : headerValue;
  if (typeof rawValue !== 'string') {
    return null;
  }
  const entries = rawValue.split(',');
  for (const entry of entries) {
    const trimmed = entry.trim();
    if (!trimmed) {
      continue;
    }
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }
    const key = trimmed.slice(0, equalsIndex).trim();
    if (key !== 'rollbar.session.id') {
      continue;
    }
    const value = trimmed.slice(equalsIndex + 1).trim();
    if (!value) {
      return null;
    }
    try {
      return decodeURIComponent(value);
    } catch (_e) {
      return value;
    }
  }
  return null;
}

function getBaggageHeader(req) {
  if (!req) {
    return null;
  }
  if (typeof req.get === 'function') {
    return req.get('baggage');
  }
  return req.headers?.baggage || null;
}

export default function rollbarExpressMiddleware(rollbar) {
  const storage = rollbar?.client.asyncLocalStorage || new AsyncLocalStorage();
  if (rollbar) {
    rollbar.client.asyncLocalStorage = storage;
  }

  return function rollbarExpressMiddlewareHandler(req, _res, next) {
    const sessionId = extractSessionId(getBaggageHeader(req));
    if (!sessionId) {
      return next();
    }
    return storage.run({ sessionId }, () => next());
  };
}
