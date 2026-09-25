import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { NextFunction, Request, Response } from 'express';
import { join } from 'node:path';

// 1) Import Rollbar
import Rollbar from 'rollbar';

const browserDistFolder = join(import.meta.dirname, '../browser');

/**
 * 2) Create a Rollbar instance with your *server-side* access token.
 *    Usually distinct from the client/browser-side token.
 */
const rollbar = new Rollbar({
  accessToken: 'ROLLBAR_POST_SERVER_ITEM_TOKEN',
  environment: 'production', // or 'development', 'staging', etc.
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// 3) Create the Express app
const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Optionally, add a test route that intentionally throws an error
 */
app.get('/api/server-error', (_req: Request, res: Response) => {
  try {
    throw new Error('Example server-side error from Angular SSR');
  } catch (error: any) {
    // Log to Rollbar
    rollbar.error(error);
    // Respond with 500
    res.status(500).send('Server error logged to Rollbar');
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * 4) An Express error-handling middleware for *unhandled* errors.
 *    This will catch SSR rendering errors (and any other thrown errors)
 *    that make it to `next(err)`.
 */
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  // Report unhandled error to Rollbar
  rollbar.error(err, req);

  // Respond with 500 (or however you want to handle SSR errors)
  res.status(500).send('An unexpected server error occurred');
});

/**
 * Start the server if this module is the main entry point, or it is run via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
