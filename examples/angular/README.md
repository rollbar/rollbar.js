# Angular + Rollbar.js

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6, with server-side rendering (Angular Universal) enabled, with updates to add rollbar.js integration for client-side and server-side errors.

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

Now, you can test the Rollbar integration by clicking the buttons "Throw an Error" and "Log a Warning". You

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

## Additional Resources

Need help? Rollbar Support can be reached via email at support@rollbar.com
