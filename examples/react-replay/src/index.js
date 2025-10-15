import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Rollbar from 'rollbar/replay';

import ErrorBoundary from './ErrorBoundary';
import TestError from './TestError';

const App = () => {
  const [rollbar] = useState(() => new Rollbar({
    accessToken: 'POST_CLIENT_ITEM_TOKEN',
    captureUncaught: true,
    captureUnhandledRejections: true,
    replay: {
      enabled: true,
      autoStart: true,
    },
  }));

  const logInfo = () => {
    // Example log event using the rollbar object.
    rollbar.info('react test log');
  };

  const throwError = () => {
    // Example error, which will be reported to rollbar.
    throw new Error('react test error');
  };

  return (
    <>
      <h1>Rollbar Example for React with Replay</h1>
      <button id="rollbar-info" onClick={logInfo}>
        Log Info
      </button>
      <button id="throw-error" onClick={throwError}>
        ThrowError
      </button>
      <ErrorBoundary rollbar={rollbar}>
        <TestError />
      </ErrorBoundary>
    </>
  );
};

const root = createRoot(document.getElementById('index'));
root.render(<App />);
