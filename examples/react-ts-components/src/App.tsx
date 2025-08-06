import React, { useState } from 'react';
import Rollbar from './rollbar';
import './App.css';

function App() {
  const [_] = useState(() => new Rollbar({
    accessToken: 'POST_CLIENT_ITEM_TOKEN',
    captureUncaught: true,
    captureUnhandledRejections: true,
  }));

  const throwError = () => {
    // Example error, which will be reported to rollbar.
    throw new Error('react test error');
  };

  return (
    <React.Fragment>
      <h1>Rollbar Example for React</h1>
      <button id="throw-error" onClick={throwError}>
        ThrowError
      </button>
    </React.Fragment>
  );
}

export default App;
