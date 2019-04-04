import React from "react";
import ReactDOM from "react-dom";
import Rollbar from "rollbar";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rollbar: new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        captureUncaught: true,
        captureUnhandledRejections: true,
      })
    };

    this.logInfo = this.logInfo.bind(this);
    this.throwError = this.throwError.bind(this);
  }

  logInfo() {
    // Example log event using the rollbar object.
    this.state.rollbar.info('react test log');
  }

  throwError() {
    // Example error, which will be reported to rollbar.
    throw new Error('react test error');
  }

  render() {
    return (
      <React.Fragment>
        <h1>Rollbar Example for React</h1>
        <button id='rollbar-info' onClick={ this.logInfo }>Log Info</button>
        <button id='throw-error' onClick={ this.throwError }>ThrowError</button>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("index"));
