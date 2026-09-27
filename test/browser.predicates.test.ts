import { expect } from 'chai';

import * as p from '../src/browser/predicates.js';

describe('checkIgnore', function () {
  it('should return false if is ajax and ignoring ajax errors is on', function () {
    const item = {
      level: 'critical',
      body: { message: { extra: { isAjax: true } } },
    };
    const settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.not.be.ok;
  });
  it('should return true if is ajax and ignoring ajax errors is off', function () {
    const item = {
      level: 'critical',
      body: { message: { extra: { isAjax: true } } },
    };
    const settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: false } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok;
  });
  it('should return true if is not ajax and ignoring ajax errors is on', function () {
    const item = {
      level: 'critical',
      body: { message: { extra: { isAjax: false } } },
    };
    const settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok;
  });
  it('should return true if no ajax extra key and ignoring ajax errors is on', function () {
    const item = {
      level: 'critical',
      body: { message: 'a message' },
    };
    const settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok;
  });
});

describe('checkBrowserExtension', function () {
  const settings = { ignoreBrowserExtensions: true };

  function traceItem(filenames) {
    return {
      level: 'error',
      body: { trace: { frames: filenames.map((filename) => ({ filename })) } },
    };
  }

  it('should return true when the option is off', function () {
    const item = traceItem(['chrome-extension://abc/injected.js']);
    expect(p.checkBrowserExtension(item, {})).to.be.ok;
    expect(p.checkBrowserExtension(item, { ignoreBrowserExtensions: false })).to
      .be.ok;
  });

  [
    'chrome-extension://hhejbopdnpbjgomhpmegemnjogflenga/injectedScript.bundle.js',
    'moz-extension://2f2d7c3a-1a2b-4c5d-8e9f-0a1b2c3d4e5f/content.js',
    'safari-extension://com.example.ext-ABCDE12345/script.js',
    'safari-web-extension://ABCDEF12-3456-7890-ABCD-EF1234567890/content.js',
    'ms-browser-extension://ext_1234/content.js',
    'webkit-masked-url://hidden/',
    'blob:chrome-extension://abc/0b1c2d3e-4f50-6172-8394-a5b6c7d8e9f0',
  ].forEach(function (filename) {
    it(`should return false when the error is thrown from ${filename}`, function () {
      const item = traceItem(['https://example.com/app.js', filename]);
      expect(p.checkBrowserExtension(item, settings)).to.not.be.ok;
    });
  });

  it('should return true when the error is thrown from application code', function () {
    const item = traceItem(['https://example.com/app.js']);
    expect(p.checkBrowserExtension(item, settings)).to.be.ok;
  });

  it('should return true when an extension frame is only lower in the stack', function () {
    // Frames are ordered with the most recent call last.
    const item = traceItem([
      'chrome-extension://abc/wrapper.js',
      'https://example.com/app.js',
    ]);
    expect(p.checkBrowserExtension(item, settings)).to.be.ok;
  });

  it('should skip frames without a URL to find the originating frame', function () {
    expect(
      p.checkBrowserExtension(
        traceItem(['chrome-extension://abc/injected.js', '(native)']),
        settings,
      ),
    ).to.not.be.ok;
    expect(
      p.checkBrowserExtension(
        traceItem(['https://example.com/app.js', '[native code]']),
        settings,
      ),
    ).to.be.ok;
  });

  it('should treat blob: and data: scripts as frames with a URL', function () {
    [
      'blob:https://example.com/0b1c2d3e-4f50-6172-8394-a5b6c7d8e9f0',
      'data:text/javascript,throw new Error()',
    ].forEach(function (filename) {
      expect(
        p.checkBrowserExtension(
          traceItem(['chrome-extension://abc/wrapper.js', filename]),
          settings,
        ),
      ).to.be.ok;
    });
  });

  it('should skip unknown frames to find the originating frame', function () {
    ['(unknown)', 'native'].forEach(function (filename) {
      expect(
        p.checkBrowserExtension(
          traceItem(['chrome-extension://abc/injected.js', filename]),
          settings,
        ),
      ).to.not.be.ok;
    });
  });

  it('should not match extension schemes elsewhere in the URL', function () {
    const item = traceItem([
      'https://example.com/chrome-extension://abc/injected.js',
    ]);
    expect(p.checkBrowserExtension(item, settings)).to.be.ok;
  });

  it('should check the primary error of a trace chain', function () {
    const extension = { frames: [{ filename: 'moz-extension://abc/c.js' }] };
    const app = { frames: [{ filename: 'https://example.com/app.js' }] };

    expect(
      p.checkBrowserExtension(
        { body: { trace_chain: [extension, app] } },
        settings,
      ),
    ).to.not.be.ok;
    expect(
      p.checkBrowserExtension(
        { body: { trace_chain: [app, extension] } },
        settings,
      ),
    ).to.be.ok;
  });

  it('should return true for items without frames', function () {
    expect(
      p.checkBrowserExtension({ body: { message: { body: 'hi' } } }, settings),
    ).to.be.ok;
    expect(p.checkBrowserExtension({ body: { trace: {} } }, settings)).to.be.ok;
    expect(p.checkBrowserExtension(traceItem([]), settings)).to.be.ok;
    expect(
      p.checkBrowserExtension(
        { body: { trace: { frames: [{ filename: { url: 'x' } }] } } },
        settings,
      ),
    ).to.be.ok;
  });
});
