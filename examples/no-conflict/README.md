# No-Conflict Mode Example

This example demonstrates how to use Rollbar's no-conflict mode, which allows multiple instances of Rollbar to coexist on the same page without interfering with each other.

## Use Case

Perfect for:
- Third-party libraries that include Rollbar internally
- Widgets or embedded tools that need their own error tracking
- Avoiding conflicts when multiple teams use Rollbar on the same page

## Setup

```bash
npm install
npm run build
npm start
```

## How It Works

1. **Main Page** (`test.html`): Uses the standard Rollbar snippet to track errors
2. **Tool Library** (`tool.js`): Uses `rollbar.noconflict.umd` to create an isolated instance
3. **Webpack Build**: Bundles the tool with its own Rollbar instance that won't conflict with the page's instance

## Key Features

- Multiple Rollbar instances can run simultaneously
- Each instance maintains its own configuration and access token
- No global namespace pollution
- Ideal for library authors who want to include Rollbar without affecting the host page

## Testing

After starting the server, visit http://localhost:3000 and:
- Click "Foo" to trigger an error tracked by the main page's Rollbar
- Click "Tool" to execute code that uses the embedded library's Rollbar
