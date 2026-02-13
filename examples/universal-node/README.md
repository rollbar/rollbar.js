# Universal Node.js Example

This example demonstrates Rollbar.js in a universal (isomorphic) JavaScript application with both server-side and client-side error tracking.

## Overview

A full-stack example featuring:
- **Server**: Express.js with server-side rendering
- **Client**: React application with webpack bundling
- **Universal**: Same error tracking on both server and client

## Setup

```bash
npm install
npm run build
npm start
```

## Features

### Server-Side Error Tracking
- Catches unhandled exceptions in Express routes
- Tracks errors with request context (user ID, headers, etc.)
- Demonstrates both error throwing and manual logging

### Client-Side Error Tracking
- React error boundaries integration
- Captures browser errors and user interactions
- Shares configuration between server and client builds

## Routes

- `/` - Main React application
- `/error` - Triggers a server-side error (demonstrates Express error handling)
- `/dolog` - Demonstrates manual server-side logging
- Click "bar" button - Triggers a client-side error

## How It Works

1. **Server** (`server.js`): Initializes Rollbar for Node.js, handles Express errors
2. **Client** (`app/App.js`): React app that triggers client-side errors
3. **Webpack**: Bundles client code with Rollbar browser SDK included
4. **Hot Reload**: Development mode includes webpack hot middleware

## Testing

Visit http://localhost:3000 and:
- Click the "bar" button to trigger a client-side error
- Click "Backend error" link to trigger a server-side error
- Check your Rollbar dashboard to see both errors tracked
