const React = require('react');
const { Provider, ErrorBoundary, useRollbar } = require('@rollbar/react');
// Import Next.js router hooks dynamically within components

/**
 * @typedef {object} RollbarOptions
 * @property {string} accessToken - Your Rollbar client-side access token.
 * @property {object} [captureUncaught] - Options for capturing uncaught errors.
 * @property {object} [captureUnhandledRejections] - Options for capturing unhandled promise rejections.
 * @property {object} [payload] - Payload options, e.g., environment.
 * // Add other Rollbar configuration options as needed
 */

/**
 * Configuration for the Rollbar ErrorBoundary component.
 * @typedef {object} ErrorBoundaryOptions
 * @property {React.ReactNode} [fallbackUI] - Custom fallback UI to render on error.
 * @property {string} [errorMessage] - Custom error message for the fallback UI.
 * // Add other ErrorBoundary props as needed
 */

/**
 * Initializes Rollbar for a Next.js application.
 * This function is intended to be a placeholder for more sophisticated router detection
 * and HOC application in the future.
 *
 * @param {React.ComponentType<any>} AppComponent - The root component of the Next.js application.
 * @param {RollbarOptions & ErrorBoundaryOptions} options - Configuration options for Rollbar and the ErrorBoundary.
 * @returns {React.ComponentType<any>} The AppComponent wrapped with appropriate Rollbar providers.
 */
function init(AppComponent, options) {
  // TODO: Implement robust router detection.
  if (options && options.isAppRouter) {
    return withRollbarAppRouter(AppComponent, options);
  }
  if (AppComponent && typeof AppComponent.router !== 'undefined') {
     return withRollbarPagesRouter(AppComponent, options);
  }
  console.warn('[Rollbar] Could not determine Next.js router type reliably. Applying App Router HOC as a default.');
  return withRollbarAppRouter(AppComponent, options);
}

/**
 * Component to handle route data collection for App Router.
 */
const AppRouterDataCollector = ({ children }) => {
  const rollbar = useRollbar();
  try {
    const { usePathname, useSearchParams } = require('next/navigation');
    const pathname = usePathname();
    const searchParams = useSearchParams();
    React.useEffect(() => {
      const routeData = { path: pathname, search: searchParams.toString() };
      rollbar.configure({ payload: { client: { javascript: { route: routeData } } } });
    }, [pathname, searchParams, rollbar]);
  } catch (e) {
    console.error('[Rollbar] Error collecting App Router data:', e);
  }
  return children;
};

/**
 * HOC for Next.js App Router: Wraps the root layout with RollbarProvider and AppRouterDataCollector.
 * @param {React.ComponentType<any>} WrappedComponent - The root layout component.
 * @param {RollbarOptions} options - Configuration for Rollbar Provider.
 * @returns {React.FC<any>} Wrapped component.
 */
function withRollbarAppRouter(WrappedComponent, options) {
  const { accessToken, payload, ...restOptions } = options || {};
  const rollbarConfig = {
    accessToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    ...payload,
    ...restOptions,
  };

  const RollbarAppRouterRoot = (props) => {
    return (
      React.createElement(Provider, { config: rollbarConfig },
        React.createElement(AppRouterDataCollector, null,
          React.createElement(WrappedComponent, props)
        )
      )
    );
  };
  RollbarAppRouterRoot.displayName = `withRollbarAppRouter(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return RollbarAppRouterRoot;
}

/**
 * Component to handle route data collection for Pages Router.
 */
const PagesRouterDataCollector = ({ children }) => {
  const rollbar = useRollbar();
  try {
    const { useRouter } = require('next/router');
    const router = useRouter();
    React.useEffect(() => {
      const routeData = { path: router.pathname, query: router.query, asPath: router.asPath };
      rollbar.configure({ payload: { client: { javascript: { route: routeData } } } });
    }, [router.pathname, router.query, router.asPath, rollbar]);
  } catch (e) {
    console.error('[Rollbar] Error collecting Pages Router data:', e);
  }
  return children;
};

/**
 * HOC for Next.js Pages Router: Wraps _app.js with RollbarProvider, ErrorBoundary, and PagesRouterDataCollector.
 * @param {React.ComponentType<any>} WrappedComponent - The _app.js component.
 * @param {RollbarOptions & ErrorBoundaryOptions} options - Configuration for Rollbar and ErrorBoundary.
 * @returns {React.FC<any>} Wrapped component.
 */
function withRollbarPagesRouter(WrappedComponent, options) {
  const { accessToken, payload, fallbackUI, errorMessage, ...restOptions } = options || {};
  const rollbarConfig = {
    accessToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    ...payload,
    ...restOptions,
  };
  const errorBoundaryProps = { fallbackUI, errorMessage };

  const RollbarPagesRouterApp = (props) => {
    return (
      React.createElement(Provider, { config: rollbarConfig },
        React.createElement(ErrorBoundary, errorBoundaryProps,
          React.createElement(PagesRouterDataCollector, null,
            React.createElement(WrappedComponent, props)
          )
        )
      )
    );
  };
  RollbarPagesRouterApp.displayName = `withRollbarPagesRouter(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return RollbarPagesRouterApp;
}

module.exports = {
  init,
  withRollbarAppRouter,
  withRollbarPagesRouter,
};
