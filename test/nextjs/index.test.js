const React = require('react');
const { render, act } = require('@testing-library/react');
const { init, withRollbarAppRouter, withRollbarPagesRouter } = require('../../src/nextjs/index');

// Mock Rollbar hooks and components
const mockRollbarConfigure = jest.fn();
const mockRollbarInstance = { configure: mockRollbarConfigure };
jest.mock('@rollbar/react', () => ({ // Mock the entire module
  ...jest.requireActual('@rollbar/react'), // Keep original ErrorBoundary, Provider
  useRollbar: () => mockRollbarInstance,
}));

// Mock Next.js navigation hooks
const mockUsePathname = jest.fn();
const mockUseSearchParams = jest.fn();
jest.mock('next/navigation', () => ({ // Mock the entire module
  usePathname: mockUsePathname,
  useSearchParams: mockUseSearchParams,
}));

// Mock Next.js router hooks
const mockUseRouter = jest.fn();
jest.mock('next/router', () => ({ // Mock the entire module
  useRouter: mockUseRouter,
}));

const TestComponent = (props) => React.createElement('div', null, 'Test Component');
const mockRollbarOptions = { accessToken: 'test-token' };

describe('Next.js Integration', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockRollbarConfigure.mockClear();
    mockUsePathname.mockClear();
    mockUseSearchParams.mockClear();
    mockUseRouter.mockClear();
    // Default mock implementations
    mockUsePathname.mockReturnValue('/test-path');
    const searchParams = new URLSearchParams();
    searchParams.set('q', 'test');
    mockUseSearchParams.mockReturnValue(searchParams);
    mockUseRouter.mockReturnValue({ pathname: '/pages-path', query: { id: '123' }, asPath: '/pages-path?id=123' });
  });

  describe('init', () => {
    it('should select withRollbarAppRouter when options.isAppRouter is true', () => {
      const Wrapped = init(TestComponent, { ...mockRollbarOptions, isAppRouter: true });
      expect(Wrapped.displayName).toContain('withRollbarAppRouter');
    });

    it('should select withRollbarPagesRouter when AppComponent.router exists', () => {
      const MockAppComponent = (props) => React.createElement('div', null, 'App Comp');
      MockAppComponent.router = {}; // Simulate Pages Router _app component
      const Wrapped = init(MockAppComponent, mockRollbarOptions);
      expect(Wrapped.displayName).toContain('withRollbarPagesRouter');
    });

    it('should default to withRollbarAppRouter if router type is unclear', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const Wrapped = init(TestComponent, mockRollbarOptions);
      expect(Wrapped.displayName).toContain('withRollbarAppRouter');
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('[Rollbar] Could not determine Next.js router type reliably'));
      consoleWarnSpy.mockRestore();
    });
  });

  describe('withRollbarAppRouter', () => {
    const WrappedAppRouterComponent = withRollbarAppRouter(TestComponent, mockRollbarOptions);

    it('should render the wrapped component', () => {
      const { getByText } = render(React.createElement(WrappedAppRouterComponent));
      expect(getByText('Test Component')).toBeDefined();
    });

    it('should collect and configure route data', () => {
      render(React.createElement(WrappedAppRouterComponent));
      expect(mockUsePathname).toHaveBeenCalled();
      expect(mockUseSearchParams).toHaveBeenCalled();
      expect(mockRollbarConfigure).toHaveBeenCalledWith({
        payload: { client: { javascript: { route: { path: '/test-path', search: 'q=test' } } } },
      });
    });

    it('should handle errors in data collection gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockUsePathname.mockImplementationOnce(() => { throw new Error('Pathname error'); });
      render(React.createElement(WrappedAppRouterComponent));
      expect(consoleErrorSpy).toHaveBeenCalledWith('[Rollbar] Error collecting App Router data:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('withRollbarPagesRouter', () => {
    const WrappedPagesRouterComponent = withRollbarPagesRouter(TestComponent, {
      ...mockRollbarOptions,
      fallbackUI: React.createElement('div', null, 'Error Fallback'),
      errorMessage: 'Custom error message',
    });

    it('should render the wrapped component', () => {
      const { getByText } = render(React.createElement(WrappedPagesRouterComponent));
      expect(getByText('Test Component')).toBeDefined();
    });

    it('should collect and configure route data', () => {
      render(React.createElement(WrappedPagesRouterComponent));
      expect(mockUseRouter).toHaveBeenCalled();
      expect(mockRollbarConfigure).toHaveBeenCalledWith({
        payload: { client: { javascript: { route: { path: '/pages-path', query: { id: '123' }, asPath: '/pages-path?id=123' } } } },
      });
    });

    // Testing ErrorBoundary is tricky. We can make the child throw an error.
    it('should render fallbackUI when child component throws an error', () => {
      const ThrowingComponent = () => { throw new Error('Test error'); };
      const WrappedErrorComponent = withRollbarPagesRouter(ThrowingComponent, {
        ...mockRollbarOptions,
        fallbackUI: React.createElement('div', null, 'Error Fallback UI'),
      });

      // Suppress console.error for this test as React and ErrorBoundary will log it
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { getByText } = render(React.createElement(WrappedErrorComponent));
      expect(getByText('Error Fallback UI')).toBeDefined();
      consoleErrorSpy.mockRestore();
    });

    it('should handle errors in data collection gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockUseRouter.mockImplementationOnce(() => { throw new Error('Router error'); });
      render(React.createElement(WrappedPagesRouterComponent));
      expect(consoleErrorSpy).toHaveBeenCalledWith('[Rollbar] Error collecting Pages Router data:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });
});
