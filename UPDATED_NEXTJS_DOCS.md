# Next.js Error Reporting with Rollbar

**Support Level: Supported**

Rollbar helps you monitor and debug errors in your Next.js applications, supporting both the App Router and Pages Router paradigms. This guide shows you how to integrate Rollbar for comprehensive error coverage.

## Overview

Integrating Rollbar into your Next.js application is now easier than ever with our `init` function. This function automatically wraps your application with the necessary Rollbar context (`RollbarProvider`), sets up a global client-side Error Boundary, and enables automatic collection of route information.

For server-side error reporting (e.g., in API routes or server components), you can still use a manually configured Rollbar instance.

## Prerequisites

*   Next.js (both [App Router and Pages Router](https://nextjs.org/docs#app-router-vs-pages-router) are supported)
*   A Rollbar account
    *   Your client-side access token (`POST_CLIENT_ITEM_TOKEN`)
    *   Your server-side access token (`POST_SERVER_ITEM_TOKEN`) (for manual server-side reporting)

## Installation

Install the Rollbar SDKs using your preferred package manager:

```bash
# npm
npm install rollbar @rollbar/react

# yarn
yarn add rollbar @rollbar/react

# pnpm
pnpm add rollbar @rollbar/react
```

## Configuration

### 1. Add Your Access Tokens

Store your Rollbar access tokens as environment variables. Create a `.env.local` file (or the appropriate [`.env` file for your environment](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)) in your project root:

```bash
NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN=YOUR_POST_CLIENT_ITEM_TOKEN
ROLLBAR_SERVER_TOKEN=YOUR_POST_SERVER_ITEM_TOKEN
```

*   `NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN`: Used for client-side error reporting. The `NEXT_PUBLIC_` prefix makes it available in the browser.
*   `ROLLBAR_SERVER_TOKEN`: Used for server-side error reporting (if you implement manual server-side reporting). **Important:** Do not prefix this token with `NEXT_PUBLIC_` to avoid exposing it to the browser.

You can find these tokens in your Rollbar project settings under "Access Tokens".

### 2. Initialize Rollbar

The `init` function from our SDK (which you'd typically place in a utility file or directly in your root layout/app file) simplifies Rollbar setup.

Create a configuration object for Rollbar. This is where you'll pass your client-side access token and any other Rollbar configuration options.

```javascript
// Example: src/config/rollbar.js (or directly in your layout/app file)
export const rollbarConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  environment: process.env.NODE_ENV || 'development', // Or your specific environment
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    // You can add custom payload data here, e.g.
    // client: {
    //   javascript: {
    //     source_map_enabled: true,
    //     code_version: process.env.NEXT_PUBLIC_APP_VERSION, // Example: your app version
    //   }
    // }
  }
  // Add other Rollbar configuration options as needed
  // See: https://docs.rollbar.com/docs/rollbarjs-configuration-reference
};
```

## Simplified Usage with `init`

The `init` function is the recommended way to set up Rollbar for most Next.js applications. It automatically:
*   Sets up the `RollbarProvider` to make Rollbar accessible via hooks.
*   Wraps your application in a global client-side `ErrorBoundary` to catch rendering errors.
*   Collects route information automatically for better context with your errors.

### App Router

In your App Router setup, apply `init` to your root layout component.

```javascript
// ./src/app/layout.js (or ./app/layout.js)
// Make sure this is a Client Component or can be wrapped by one if init creates context.
// Our init function returns a HOC that handles Provider setup.

import { init } from 'your-rollbar-sdk-package/nextjs'; // Adjust path to your SDK's nextjs module
import { rollbarConfig } from '../config/rollbar'; // Path to your Rollbar config

// Your RootLayout component
function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// Wrap your RootLayout with init
export default init(RootLayout, rollbarConfig);
```
**Note:** If your `RootLayout` needs to be a Server Component, you might need to adjust this pattern, potentially by wrapping `init` around a Client Component that itself includes your main layout structure, or by using `init` within a Client Component wrapper inside `RootLayout`. The `init` HOC itself will provide React Context, which requires it to be part of a Client Component tree.

### Pages Router

In your Pages Router setup, apply `init` to your custom `_app.js` component.

```javascript
// ./src/pages/_app.js (or ./pages/_app.js)

import { init } from 'your-rollbar-sdk-package/nextjs'; // Adjust path to your SDK's nextjs module
import { rollbarConfig } from '../config/rollbar'; // Path to your Rollbar config
import'@/styles/globals.css'; // Example global styles

// Your custom App component
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// Wrap your App component with init
export default init(MyApp, rollbarConfig);
```

With `init`, Rollbar is now set up to automatically capture client-side errors and route data.

## Advanced Error Handling & Customization

While `init` provides global error coverage, Next.js offers patterns for more granular error handling, and you might have specific server-side reporting needs.

### App Router: `error.js` and `global-error.js`

Next.js App Router uses special files for error handling:
*   `error.js`: Handles errors within specific route segments. Create this file in your route directories.
*   `global-error.js`: Handles errors in the root layout. Create this in your `app` or `src/app` directory.

You can use the `useRollbar` hook from `@rollbar/react` within these Client Components to manually send errors to Rollbar, potentially adding more context.

```javascript
// ./src/app/some-route/error.js
'use client';

import { useEffect } from 'react';
import { useRollbar } from '@rollbar/react'; // Assuming init has set up Provider

export default function ErrorPage({ error, reset }) {
  const rollbar = useRollbar();

  useEffect(() => {
    if (error) {
      rollbar.error('Error in some-route', error); // Send error to Rollbar
    }
  }, [error, rollbar]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

For `global-error.js`, if the error occurs very early before the main `RollbarProvider` (set up by `init` in `layout.js`) is initialized, `useRollbar()` might not be available. In such rare cases, you might instantiate a new Rollbar client instance directly within `global-error.js` using `clientConfig`.

```javascript
// ./src/app/global-error.js
'use client';

import { useEffect } from 'react';
import Rollbar from 'rollbar'; // Direct import
import { rollbarConfig } from '../config/rollbar'; // Your shared client config
// import { ResetPage } from '@/components/ResetPage'; // Example component

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Check if useRollbar() is available, otherwise create a new instance
    // This example directly creates one for simplicity in global-error
    const rollbarInstance = new Rollbar(rollbarConfig);
    rollbarInstance.error('Global error caught', error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong globally!</h2>
        {/* <ResetPage reset={reset} /> */}
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

### Manual ErrorBoundary Usage

For fine-grained control over specific parts of your UI, you can still use the `<ErrorBoundary>` component from `@rollbar/react` directly in your Client Components. This is generally less needed if `init` is used globally.

```javascript
// Example in a Client Component
'use client';
import { ErrorBoundary } from '@rollbar/react';

function MyComponent() {
  // ... component logic
  return <div>My potentially buggy component</div>;
}

export default function SafeComponent() {
  return (
    <ErrorBoundary fallbackUI={<div>Oops, MyComponent crashed.</div>}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Server-Side Error Reporting (Manual)

The `init` function primarily focuses on client-side setup. For reporting errors from your server-side code (e.g., API routes, Server Components, `getServerSideProps`), you'll need a Rollbar instance configured with your server-side access token.

You can adapt the `serverInstance` concept from previous documentation:

```javascript
// ./src/config/rollbar.js (extending the previous example)
import Rollbar from 'rollbar';

export const clientConfig = { /* ... as defined before ... */ };

// Separate instance for server-side reporting
let serverRollbarInstance = null;
if (typeof window === 'undefined') { // Ensure this runs only server-side
  serverRollbarInstance = new Rollbar({
    accessToken: process.env.ROLLBAR_SERVER_TOKEN,
    environment: process.env.NODE_ENV || 'development',
    captureUncaught: true, // For server-side uncaught exceptions
    captureUnhandledRejections: true, // For server-side unhandled rejections
    // Add other server-specific configurations
  });
}
export const serverInstance = serverRollbarInstance;

```

Then, in your API routes or server-side logic:

```javascript
// Example: ./src/app/api/myroute/route.js (App Router)
// or ./src/pages/api/myhandler.js (Pages Router)

import { serverInstance as rollbar } from '../../../config/rollbar'; // Adjust path

export async function GET(request) {
  try {
    // Your API logic...
    if (someCondition) {
      throw new Error('Something went wrong in the API!');
    }
    return Response.json({ message: 'Success' });
  } catch (e) {
    if (rollbar) {
      rollbar.error('API Error in myroute', e, { request }); // Log error with request context
    }
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

## Notes

*   **Development Mode**: Next.js's development server has its own error handling. To see Rollbar fully in action, especially with custom error UIs, test with a production build (`next build && next start`).
*   **Source Maps**: Ensure you have source maps configured correctly in your Next.js build to get meaningful stack traces in Rollbar. Refer to Next.js and Rollbar source map documentation.
*   **Further Reading**: For more details on `@rollbar/react` components like `<Provider>` and `<ErrorBoundary>`, and the `useRollbar` hook, refer to the [Rollbar React SDK documentation](https://github.com/rollbar/rollbar-react/tree/main).

---
Many thanks to Max Schmitt, whose original blog post ([Error Reporting with Rollbar & Next.js](https://maxschmitt.me/posts/error-reporting-rollbar-nextjs/)) provided the foundation for earlier versions of this documentation.
