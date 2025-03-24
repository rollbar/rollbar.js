import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express, { NextFunction, Request, Response } from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

// 1) Import Rollbar
import Rollbar from 'rollbar';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

/**
 * 2) Create a Rollbar instance with your *server-side* access token.
 *    Usually distinct from the client/browser-side token.
 */
const rollbar = new Rollbar({
  accessToken: 'POST_SERVER_ITEM_ACCESS_TOKEN',
  environment: 'production', // or 'development', 'staging', etc.
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// 3) Create the Express app
const app = express();
const commonEngine = new CommonEngine();

/**
 * Optionally, add a test route that intentionally throws an error
 */
app.get('/api/server-error', (_req: Request, res: Response) => {
  try {
    throw new Error('Example server-side error from Angular Universal');
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
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }),
);

/**
 * Handle SSR rendering with Angular's CommonEngine
 */
app.get('**', (req: Request, res: Response, next: NextFunction) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html: string) => res.send(html))
    .catch((err: any) => next(err));
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
 * Start the server if this module is the main entry point.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
