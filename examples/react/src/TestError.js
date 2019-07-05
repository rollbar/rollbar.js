import React from 'react';

class TestError extends React.Component {
  constructor(props) {
    super(props);

    this.state = { throwError: false };

    this.setErrorState = this.setErrorState.bind(this);
  }

  setErrorState() {
    // Use an error state and throw inside render,
    // because React won't send errors within event handlers
    // to the error boundary component.
    this.setState({ throwError: true });
  }

  render() {
    if (this.state.throwError) {
      throw new Error('react child test error');
    }
    return (
      <React.Fragment>
        <h1>Rollbar Example for React Child Component</h1>
        <button id='child-error' onClick={ this.setErrorState }>Throw Child Error</button>
      </React.Fragment>
    );
  }
}

export default TestError;
