# Universal Browser Example

This example demonstrates using Rollbar.js with the async snippet pattern in a browser environment.

## Setup

```bash
npm install
npm start
```

## Usage

Visit http://localhost:3000/test to see the example in action.

## How it works

- Uses the Rollbar snippet to asynchronously load the library
- Includes a test server to avoid CORS issues when loading local files
- Demonstrates error capture when clicking buttons that call undefined functions
