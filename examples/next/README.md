# Rollbar Next.js Example

This example demonstrates how to integrate Rollbar error monitoring into a Next.js application using JavaScript.

## Features

- ✅ Next.js with JavaScript (no TypeScript)
- ✅ Rollbar error tracking integration using `@rollbar/react`
- ✅ Error Boundary for catching component errors
- ✅ Manual error reporting
- ✅ Uncaught error tracking
- ✅ Promise rejection handling
- ✅ Custom message logging
- ✅ Server-side rendering (SSR) compatible

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
   
   Note: Use npm (not yarn) to ensure the local Rollbar package symlink works correctly.

2. **Configure Rollbar:**
   - Open `pages/index.js`
   - Replace `'YOUR_CLIENT_ACCESS_TOKEN'` with your actual Rollbar project access token
   - You can get your access token from your Rollbar project settings

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   The app will start on http://localhost:3001

## Usage

The example provides several interactive buttons to demonstrate Rollbar features:

### 1. **Trigger Manual Error**
Shows how to catch and manually report errors to Rollbar using `rollbar.error()`.

### 2. **Trigger Uncaught Error**
Demonstrates how Rollbar automatically captures uncaught runtime errors.

### 3. **Trigger Promise Rejection**
Shows automatic capture of unhandled promise rejections.

### 4. **Toggle Component Error**
Demonstrates how the Error Boundary catches React component errors and reports them to Rollbar.

### 5. **Log Custom Message**
Shows how to log custom messages and events using `rollbar.info()` and `rollbar.log()`.

## Key Integration Points

### Provider Setup
The app wraps the main component with Rollbar's Provider and ErrorBoundary:

```javascript
<Provider instance={rollbar}>
  <ErrorBoundary>
    <YourApp />
  </ErrorBoundary>
</Provider>
```

### Using the Rollbar Hook
Components can access the Rollbar instance using the `useRollbar` hook:

```javascript
const rollbar = useRollbar();
rollbar.error('Something went wrong', error);
```

### Configuration Options
Common configuration options demonstrated:
- `accessToken`: Your Rollbar project token
- `environment`: Environment name (development, production, etc.)
- `captureUncaught`: Automatically capture uncaught errors
- `captureUnhandledRejections`: Automatically capture promise rejections
- `payload`: Additional data sent with every error (user info, version, etc.)

## Server-Side Considerations

For production deployments with server-side rendering:

1. Initialize Rollbar differently on the server
2. Use environment variables for sensitive configuration
3. Consider implementing custom error pages (`pages/_error.js`)
4. Add source map support for better debugging

## Building for Production

```bash
npm run build
npm run start
```

This creates an optimized production build and starts the production server on port 3001.

## Project Structure

```
├── pages/
│   ├── index.js          # Main page with Rollbar integration
│   └── posts/
│       └── first-post.js # Example additional page
├── styles/
│   ├── Home.module.css   # Component styles
│   └── global.css        # Global styles
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Learn More

- [Rollbar Documentation](https://docs.rollbar.com/)
- [Rollbar React SDK](https://docs.rollbar.com/docs/react)
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Error Handling](https://nextjs.org/docs/basic-features/error-handling)
