import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // Render on each request rather than at build time, so errors thrown while
    // rendering are reported by `server.ts` along with the request.
    renderMode: RenderMode.Server,
  },
];
