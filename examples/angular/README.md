# Angular + Rollbar.js

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) and updated to Angular 22, with server-side rendering enabled and rollbar.js integrated for client-side and server-side errors.

Angular 22 requires Node.js `^22.22.3 || ^24.15.0 || >=26.0.0`.

## How Rollbar is integrated

- `src/app/rollbar.config.ts` creates the client-side Rollbar instance.
- `src/app/rollbar.service.ts` loads that file with a dynamic `import()`, so Rollbar is kept out of the initial bundle and downloaded as a separate chunk. `src/app/app.config.ts` starts loading it as soon as the app starts, so telemetry is collected before the first error.
- `src/app/rollbar.errorhandler.ts` replaces Angular's `ErrorHandler`. It logs each error to the console and sends it to Rollbar once Rollbar has loaded, so errors that happen while the chunk is still downloading are not lost.
- `provideBrowserGlobalErrorListeners()` forwards uncaught errors and unhandled promise rejections to that `ErrorHandler`. This is why `captureUncaught` and `captureUnhandledRejections` are turned off in `rollbar.config.ts`: leaving them on would report those errors twice.
- `src/server.ts` creates a separate server-side Rollbar instance for the Express server.

The app runs without zone.js, which is the default since Angular 21.

## Add your Rollbar tokens

To use this example, add your Rollbar tokens. You can find the tokens in the Rollbar UI for your project. Go to Project Settings, then Project Access Tokens, and note the post_client_item token (client-side token) and post_server_item token (server-side token, if using).

Add the client-side token in src/app/rollbar.config.ts by replacing `ROLLBAR_POST_CLIENT_ITEM_TOKEN` with your post_client_item token.

Add the server-side token in src/server.ts by replacing `ROLLBAR_POST_SERVER_ITEM_TOKEN` with your post_server_item token.

## Development server - client-side

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

Now, you can test the Rollbar integration by clicking the buttons "Throw an Error" and "Log a Warning". You should see the error and the warning in the Rollbar UI within a few seconds.

## Development server - server-side

To run the server-side rendering server, first build:

```bash
npm run build
```

then run:

```bash
npm run serve:ssr:angular
```

Once the server is running, open your browser and navigate to `http://localhost:4000/`

Now, you can test the Rollbar integration by navigating to the url `http://localhost:4000/api/server-error`. You should see "Server error logged to Rollbar" in your browser and the error should appear in the Rollbar UI within a few seconds.

The server only renders requests whose `Host` header is listed in `security.allowedHosts` in `angular.json`, which protects against server-side request forgery. This example allows `localhost`; add your own hostnames before deploying it.

## Running unit tests

To run the unit tests with [Vitest](https://vitest.dev/), run:

```bash
npm test
```

## Additional Resources

Need help? Rollbar Support can be reached via email at support@rollbar.com
