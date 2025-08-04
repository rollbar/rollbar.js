import React, { useState } from 'react';
import Rollbar from 'rollbar';
import ErrorBoundary from './ErrorBoundary';
import TestError from './TestError';

function App() {
  const [rollbar] = useState(() => new Rollbar({
    accessToken: 'POST_CLIENT_ITEM_TOKEN',
    captureUncaught: true,
    captureUnhandledRejections: true,
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
    <React.Fragment>
      <h1>Rollbar Example for React</h1>
      <button id="rollbar-info" onClick={logInfo}>
        Log Info
      </button>
      <button id="throw-error" onClick={throwError}>
        ThrowError
      </button>
      <ErrorBoundary rollbar={rollbar}>
        <TestError />
      </ErrorBoundary>
    </React.Fragment>
  );
}

export default App;
