import { expect } from 'chai';
import sinon from 'sinon';

import Rollbar from '../src/browser/core.js';
import Instrumenter from '../src/browser/telemetry.js';
import Telemeter from '../src/telemetry.js';
import Tracing from '../src/tracing/tracing.js';

import { loadHtml } from './util/fixtures.ts';

describe('instrumentNetwork', function () {
  it('should capture XHR requests with string URL', function (done) {
    const callback = sinon.spy();
    const windowMock = {
      XMLHttpRequest: function () {},
    };

    windowMock.XMLHttpRequest.prototype.open = function () {};
    windowMock.XMLHttpRequest.prototype.send = function () {};

    let i = createInstrumenter({ captureNetwork: callback }, windowMock);
    i.instrumentNetwork();

    const xhr = new windowMock.XMLHttpRequest();
    xhr.open('GET', 'http://first.call');
    xhr.send();
    xhr.onreadystatechange();

    expect(callback.callCount).to.eql(1);
    expect(callback.args[0][0].url).to.eql('http://first.call');

    i.deinstrumentNetwork();
    i = createInstrumenter({ captureNetwork: callback }, windowMock);
    i.instrumentNetwork();
    const xhr2 = new windowMock.XMLHttpRequest();
    xhr2.open('GET', new URL('http://second.call'));
    xhr2.send();
    xhr2.onreadystatechange();
    expect(callback.callCount).to.eql(2);
    expect(callback.args[1][0].url).to.eql('http://second.call/');

    done();
  });

  it('should capture XHR requests with string URL', function (done) {
    const callback = sinon.spy();
    const windowMock = {
      fetch: (_) => Promise.resolve(),
    };

    let i = createInstrumenter({ captureNetwork: callback }, windowMock);
    i.instrumentNetwork();

    windowMock.fetch('http://first.call');
    expect(callback.callCount).to.eql(1);
    expect(callback.args[0][0].url).to.eql('http://first.call');

    i.deinstrumentNetwork();
    i = createInstrumenter({ captureNetwork: callback }, windowMock);
    i.instrumentNetwork();

    windowMock.fetch(new URL('http://second.call'));
    expect(callback.callCount).to.eql(2);
    expect(callback.args[1][0].url).to.eql('http://second.call/');

    done();
  });

  // https://github.com/rollbar/rollbar.js/issues/1451
  describe('when XMLHttpRequest.prototype cannot be patched', function () {
    function createWindowMock() {
      const open = function () {};
      const setRequestHeader = function () {};
      const send = function () {};
      const fetch = (_) => Promise.resolve();
      const XMLHttpRequest = function () {};
      XMLHttpRequest.prototype.open = open;
      XMLHttpRequest.prototype.setRequestHeader = setRequestHeader;
      XMLHttpRequest.prototype.send = send;
      return {
        windowMock: { XMLHttpRequest, fetch },
        originals: { open, setRequestHeader, send, fetch },
      };
    }

    function expectXhrUntouched(windowMock, originals) {
      const xhrp = windowMock.XMLHttpRequest.prototype;
      expect(xhrp.open).to.equal(originals.open);
      expect(xhrp.setRequestHeader).to.equal(originals.setRequestHeader);
      expect(xhrp.send).to.equal(originals.send);
    }

    it('should not throw when open is read-only', function () {
      const callback = sinon.spy();
      const { windowMock, originals } = createWindowMock();
      Object.defineProperty(windowMock.XMLHttpRequest.prototype, 'open', {
        value: originals.open,
        writable: false,
      });

      const i = createInstrumenter(callback, windowMock);
      expect(() => i.instrumentNetwork()).to.not.throw();

      expectXhrUntouched(windowMock, originals);
      expect(i.diagnostic.instrumentNetwork).to.eql({
        xhr: 'skipped: XMLHttpRequest.prototype not writable (open)',
      });
    });

    it('should leave XHR unpatched when only a later method is read-only', function () {
      const callback = sinon.spy();
      const { windowMock, originals } = createWindowMock();
      Object.defineProperty(windowMock.XMLHttpRequest.prototype, 'send', {
        value: originals.send,
        writable: false,
      });

      const i = createInstrumenter(callback, windowMock);
      expect(() => i.instrumentNetwork()).to.not.throw();

      // open and setRequestHeader were patchable, but without send the XHR
      // telemetry is incomplete, so they must be rolled back.
      expectXhrUntouched(windowMock, originals);
      expect(i.diagnostic.instrumentNetwork).to.eql({
        xhr: 'skipped: XMLHttpRequest.prototype not writable (send)',
      });
    });

    it('should not throw when the prototype is frozen', function () {
      const callback = sinon.spy();
      const { windowMock, originals } = createWindowMock();
      Object.freeze(windowMock.XMLHttpRequest.prototype);

      const i = createInstrumenter(callback, windowMock);
      expect(() => i.instrumentNetwork()).to.not.throw();

      expectXhrUntouched(windowMock, originals);
      expect(i.diagnostic.instrumentNetwork).to.eql({
        xhr: 'skipped: XMLHttpRequest.prototype not writable (open, setRequestHeader, send)',
      });
    });

    it('should not record a diagnostic when XHR is patched', function () {
      const callback = sinon.spy();
      const { windowMock } = createWindowMock();

      const i = createInstrumenter(callback, windowMock);
      i.instrumentNetwork();

      expect(i.diagnostic).to.not.have.property('instrumentNetwork');
    });

    it('should still instrument fetch and deinstrument cleanly', function () {
      const callback = sinon.spy();
      const { windowMock, originals } = createWindowMock();
      Object.freeze(windowMock.XMLHttpRequest.prototype);

      const i = createInstrumenter(callback, windowMock);
      i.instrumentNetwork();

      expect(windowMock.fetch).to.not.equal(originals.fetch);
      windowMock.fetch('http://fetch.call');
      expect(callback.callCount).to.eql(1);
      expect(callback.args[0][0].url).to.eql('http://fetch.call');

      expect(() => i.deinstrumentNetwork()).to.not.throw();
      expect(windowMock.fetch).to.equal(originals.fetch);
      expectXhrUntouched(windowMock, originals);
    });
  });
});

describe('instrumentConsole', function () {
  it('should capture module namespace objects', async function () {
    const log = sinon.spy();
    const captureLog = sinon.spy();
    const windowMock = { console: { log } };
    createInstrumenter({ captureLog }, windowMock).instrumentConsole();

    const ns = await import('./fixtures/esm-module.js');
    windowMock.console.log(ns);

    expect(captureLog.calledOnce).to.eql(true);
    expect(captureLog.args[0][0]).to.eql('{"x":1}');
    expect(log.calledOnceWithExactly(ns)).to.eql(true);
  });

  it('should call the original console method if telemetry throws', function () {
    const log = sinon.spy();
    const captureLog = sinon.stub().throws(new Error('boom'));
    const windowMock = { console: { log } };
    const instrumenter = createInstrumenter({ captureLog }, windowMock);
    instrumenter.instrumentConsole();

    expect(() => windowMock.console.log('hello')).to.not.throw();
    expect(log.calledOnceWithExactly('hello')).to.eql(true);
    expect(instrumenter.diagnostic.captureLog).to.eql({ error: 'boom' });
  });
});

describe('instrumentDom', function () {
  const wait_ms = 1; //ensure events are sent before assertions
  let tracing, telemeter, instrumenter, mask, options, rollbar, scrubFields;
  const wait = (t) => new Promise((resolve) => setTimeout(resolve, t));

  beforeEach(async function () {
    await loadHtml('test/fixtures/html/dom-events.html');
    scrubFields = ['foo', 'bar'];
    mask = '******';
    options = { scrubFields, autoInstrument: { log: false } };
    rollbar = new Rollbar({});
    tracing = new Tracing(window, null, {});
    tracing.initSession();
    telemeter = new Telemeter({}, tracing);
    instrumenter = new Instrumenter(options, telemeter, rollbar, window);
    instrumenter.instrument();
  });

  it('should handle select type input events', async function () {
    const elem = _getElementById('fruit-select');

    const domEvent = new InputEvent('input');
    elem.value = 'orange';
    elem.dispatchEvent(domEvent);

    await wait(wait_ms);

    expect(telemeter.queue.length).to.eql(1);
    const event = telemeter.queue[0];
    expect(event.type).to.eql('dom');
    expect(event.body.type).to.eql('rollbar-input-event');
    expect(event.body.subtype).to.eql('select');
    expect(event.body.element).to.match(
      /select#fruit-select\[name="selectedFruit"\]/,
    );
    expect(event.body.value).to.eql('orange');

    expect(event.otelAttributes.type).to.eql('select');
    expect(event.otelAttributes.isSynthetic).to.eql(true);
    expect(event.otelAttributes.element).to.match(
      /select#fruit-select\[name="selectedFruit"\]/,
    );
    expect(event.otelAttributes.value).to.eql('orange');
    expect(event.otelAttributes.endTimeUnixNano[0]).to.be.a('number');
    expect(event.otelAttributes.endTimeUnixNano[1]).to.be.a('number');
  });

  it('should handle checkbox type input events', async function () {
    const elem = _getElementById('remember-me-checkbox');

    const pointerOptions = {
      pointerId: 1,
      bubbles: true,
      cancelable: true,
      pointerType: 'touch',
      isPrimary: true,
    };
    const domEvent = new PointerEvent('click', pointerOptions);
    //elem.value = 'on';
    elem.dispatchEvent(domEvent);

    await wait(wait_ms);

    expect(telemeter.queue.length).to.eql(1);
    const event = telemeter.queue[0];
    expect(event.type).to.eql('dom');
    expect(event.body.type).to.eql('rollbar-input-event');
    expect(event.body.subtype).to.eql('checkbox');
    expect(event.body.element).to.match(
      /input#remember-me-checkbox\[type="checkbox"\]/,
    );
    expect(event.body.value).to.eql(true);

    expect(event.otelAttributes.type).to.eql('checkbox');
    expect(event.otelAttributes.isSynthetic).to.eql(false);
    expect(event.otelAttributes.element).to.match(
      /input#remember-me-checkbox\[type="checkbox"\]/,
    );
    expect(event.otelAttributes.value).to.eql(true);
    expect(event.otelAttributes.endTimeUnixNano[0]).to.be.a('number');
    expect(event.otelAttributes.endTimeUnixNano[1]).to.be.a('number');
  });

  it('should handle textarea type input events', async function () {
    const elem = _getElementById('textarea-1');

    const domEvent = new InputEvent('input');
    elem.value = 'radar';
    elem.dispatchEvent(domEvent);

    await wait(wait_ms);

    expect(telemeter.queue.length).to.eql(1);
    const event = telemeter.queue[0];
    expect(event.type).to.eql('dom');
    expect(event.body.type).to.eql('rollbar-input-event');
    expect(event.body.subtype).to.eql('textarea');
    expect(event.body.element).to.match(/textarea#textarea-1/);
    expect(event.body.value).to.eql('radar');

    expect(event.otelAttributes.type).to.eql('textarea');
    expect(event.otelAttributes.isSynthetic).to.eql(true);
    expect(event.otelAttributes.element).to.match(/textarea#textarea-1/);
    expect(event.otelAttributes.value).to.eql('radar');
    expect(event.otelAttributes.endTimeUnixNano[0]).to.be.a('number');
    expect(event.otelAttributes.endTimeUnixNano[1]).to.be.a('number');
  });

  it('should handle password type input events', async function () {
    const elem = _getElementById('password-input');

    const domEvent = new InputEvent('input');
    elem.value = 'radar';
    elem.dispatchEvent(domEvent);

    await wait(wait_ms);

    expect(telemeter.queue.length).to.eql(1);
    const event = telemeter.queue[0];
    expect(event.type).to.eql('dom');
    expect(event.body.type).to.eql('rollbar-input-event');
    expect(event.body.subtype).to.eql('password');
    expect(event.body.element).to.match(/password/);
    expect(event.body.value).to.eql('******');

    expect(event.otelAttributes.type).to.eql('password');
    expect(event.otelAttributes.isSynthetic).to.eql(true);
    expect(event.otelAttributes.element).to.match(/password/);
    expect(event.otelAttributes.value).to.eql('******');
    expect(event.otelAttributes.endTimeUnixNano[0]).to.be.a('number');
    expect(event.otelAttributes.endTimeUnixNano[1]).to.be.a('number');
  });

  it('should handle online/offline events', async function () {
    const offlineEvent = new Event('offline');
    const onlineEvent = new Event('online');

    window.dispatchEvent(offlineEvent);
    window.dispatchEvent(onlineEvent);

    await wait(wait_ms);

    expect(telemeter.queue.length).to.eql(2);
    let event = telemeter.queue[0];
    expect(event.type).to.eql('connectivity');
    expect(event.body.type).to.eql('rollbar-connectivity-event');
    expect(event.body.subtype).to.eql('offline');

    expect(event.otelAttributes.type).to.eql('offline');
    expect(event.otelAttributes.isSynthetic).to.eql(true);

    event = telemeter.queue[1];
    expect(event.type).to.eql('connectivity');
    expect(event.body.type).to.eql('rollbar-connectivity-event');
    expect(event.body.subtype).to.eql('online');

    expect(event.otelAttributes.type).to.eql('online');
    expect(event.otelAttributes.isSynthetic).to.eql(true);
  });

  it('should handle drag drop events', async function () {
    const draggable = _getElementById('draggable');
    const dropzone = _getElementById('dropzone');

    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', 'some data');

    const dragEvent = new DragEvent('dragstart', {
      dataTransfer: dataTransfer,
    });
    draggable.dispatchEvent(dragEvent);

    const dragOverEvent = new DragEvent('dragover', {
      dataTransfer: dataTransfer,
      bubbles: true,
      cancelable: true,
    });
    dragOverEvent.preventDefault = () => {};
    dropzone.dispatchEvent(dragOverEvent);

    const dropEvent = new DragEvent('drop', {
      dataTransfer: dataTransfer,
      bubbles: true,
      cancelable: true,
    });
    dropEvent.preventDefault = () => {};
    dropzone.dispatchEvent(dropEvent);

    await wait(wait_ms);

    expect(telemeter.queue.length).to.eql(2);
    const events = telemeter.queue;

    expect(events[0].type).to.eql('dom');
    expect(events[0].body.type).to.eql('rollbar-dragdrop-event');
    expect(events[0].body.subtype).to.eql('dragstart');
    expect(events[0].body.element).to.match(/p#draggable/);

    expect(events[0].otelAttributes.type).to.eql('dragstart');
    expect(events[0].otelAttributes.isSynthetic).to.eql(true);
    expect(events[0].otelAttributes.element).to.match(/p#draggable/);

    expect(events[1].type).to.eql('dom');
    expect(events[1].body.type).to.eql('rollbar-dragdrop-event');
    expect(events[1].body.subtype).to.eql('drop');
    expect(events[1].body.element).to.match(/div#dropzone/);

    expect(events[1].otelAttributes.type).to.eql('drop');
    expect(events[1].otelAttributes.isSynthetic).to.eql(true);
    expect(events[1].otelAttributes.element).to.match(/div#dropzone/);
    expect(events[1].otelAttributes.kinds).to.eql('["string"]');
    expect(events[1].otelAttributes.mediaTypes).to.eql('["text/plain"]');
    expect(events[1].otelAttributes.dropEffect).to.eql('none');
    expect(events[1].otelAttributes.effectAllowed).to.eql('none');
  });

  it('should combine repeated click events', async function () {
    const elem = _getElementById('button-1');

    const pointerOptions = {
      pointerId: 1,
      bubbles: true,
      cancelable: true,
      pointerType: 'touch',
      isPrimary: true,
    };
    let domEvent = new PointerEvent('click', pointerOptions);
    elem.dispatchEvent(domEvent);

    domEvent = new PointerEvent('click', pointerOptions);
    elem.dispatchEvent(domEvent);

    domEvent = new PointerEvent('click', pointerOptions);
    elem.dispatchEvent(domEvent);

    await wait(wait_ms);

    expect(telemeter.queue.length).to.eql(1);
    const event = telemeter.queue[0];
    expect(event.type).to.eql('dom');
    expect(event.body.type).to.eql('rollbar-click-event');
    expect(event.body.subtype).to.eql('click');
    expect(event.body.element).to.match(/button#button-1.myButton/);

    expect(event.otelAttributes.type).to.eql('click');
    expect(event.otelAttributes.isSynthetic).to.eql(true);
    expect(event.otelAttributes.element).to.match(/button#button-1.myButton/);
    expect(event.otelAttributes.endTimeUnixNano[0]).to.be.a('number');
    expect(event.otelAttributes.endTimeUnixNano[1]).to.be.a('number');
    expect(event.otelAttributes.count).to.eql(3);
    expect(event.otelAttributes.rate).to.be.a('number');
  });

  it('should combine repeated input events', async function () {
    const elem = _getElementById('text-input');

    let domEvent = new InputEvent('input');
    elem.value = 'a';
    elem.dispatchEvent(domEvent);

    domEvent = new InputEvent('input');
    elem.value = 'ab';
    elem.dispatchEvent(domEvent);

    domEvent = new InputEvent('input');
    elem.value = 'abc';
    elem.dispatchEvent(domEvent);

    await wait(wait_ms);

    expect(telemeter.queue.length).to.eql(1);
    const event = telemeter.queue[0];
    expect(event.type).to.eql('dom');
    expect(event.body.type).to.eql('rollbar-input-event');
    expect(event.body.subtype).to.eql('text');
    expect(event.body.element).to.match(
      /input#text-input.rb-scrub\[type="text"\]/,
    );
    expect(event.body.value).to.eql('abc');

    expect(event.otelAttributes.type).to.eql('text');
    expect(event.otelAttributes.isSynthetic).to.eql(true);
    expect(event.otelAttributes.element).to.match(
      /input#text-input.rb-scrub\[type="text"\]/,
    );
    expect(event.otelAttributes.value).to.eql('abc');
    expect(event.otelAttributes.endTimeUnixNano[0]).to.be.a('number');
    expect(event.otelAttributes.endTimeUnixNano[1]).to.be.a('number');
    expect(event.otelAttributes.count).to.eql(3);
    expect(event.otelAttributes.rate).to.be.a('number');
  });

  describe('scrubbing', function () {
    it('should scrub input when scrubTelemetryInputs is set', async function () {
      instrumenter.configure({ scrubTelemetryInputs: true });
      const elem = _getElementById('text-input');

      const domEvent = new InputEvent('input');
      elem.value = 'radar';
      elem.dispatchEvent(domEvent);

      await wait(wait_ms);

      expect(telemeter.queue.length).to.eql(1);
      const event = telemeter.queue[0];
      expect(event.type).to.eql('dom');
      expect(event.body.type).to.eql('rollbar-input-event');
      expect(event.body.value).to.eql(mask);
      expect(event.otelAttributes.value).to.eql(mask);
    });

    it('should scrub input when scrubFields is set', async function () {
      instrumenter.configure({ scrubFields: ['secret'] });
      const elem = _getElementById('text-input');

      const domEvent = new InputEvent('input');
      elem.value = 'radar';
      elem.dispatchEvent(domEvent);

      await wait(wait_ms);

      expect(telemeter.queue.length).to.eql(1);
      const event = telemeter.queue[0];
      expect(event.type).to.eql('dom');
      expect(event.body.type).to.eql('rollbar-input-event');
      expect(event.body.value).to.eql(mask);
      expect(event.otelAttributes.value).to.eql(mask);
    });

    it('should scrub input when replay.maskAllInputs is set', async function () {
      instrumenter.configure({ replay: { maskAllInputs: true } });
      const elem = _getElementById('text-input');

      const domEvent = new InputEvent('input');
      elem.value = 'radar';
      elem.dispatchEvent(domEvent);

      await wait(wait_ms);

      expect(telemeter.queue.length).to.eql(1);
      const event = telemeter.queue[0];
      expect(event.type).to.eql('dom');
      expect(event.body.type).to.eql('rollbar-input-event');
      expect(event.body.value).to.eql(mask);
      expect(event.otelAttributes.value).to.eql(mask);
    });

    it('should scrub input when replay.blockClass is set', async function () {
      instrumenter.configure({ replay: { blockClass: 'rb-scrub' } });
      const elem = _getElementById('text-input');

      const domEvent = new InputEvent('input');
      elem.value = 'radar';
      elem.dispatchEvent(domEvent);

      await wait(wait_ms);

      expect(telemeter.queue.length).to.eql(1);
      const event = telemeter.queue[0];
      expect(event.type).to.eql('dom');
      expect(event.body.type).to.eql('rollbar-input-event');
      expect(event.body.value).to.eql(mask);
      expect(event.otelAttributes.value).to.eql(mask);
    });

    it('should scrub input when replay.blockClass uses regex', async function () {
      instrumenter.configure({ replay: { blockClass: /rb.scrub/ } });
      const elem = _getElementById('text-input');

      const domEvent = new InputEvent('input');
      elem.value = 'radar';
      elem.dispatchEvent(domEvent);

      await wait(wait_ms);

      expect(telemeter.queue.length).to.eql(1);
      const event = telemeter.queue[0];
      expect(event.type).to.eql('dom');
      expect(event.body.type).to.eql('rollbar-input-event');
      expect(event.body.value).to.eql(mask);
      expect(event.otelAttributes.value).to.eql(mask);
    });

    it('should scrub input when replay.blockSelector is set', async function () {
      instrumenter.configure({
        replay: { blockSelector: 'div.container > label > input#text-input' },
      });
      const elem = _getElementById('text-input');

      const domEvent = new InputEvent('input');
      elem.value = 'radar';
      elem.dispatchEvent(domEvent);

      await wait(wait_ms);

      expect(telemeter.queue.length).to.eql(1);
      const event = telemeter.queue[0];
      expect(event.type).to.eql('dom');
      expect(event.body.type).to.eql('rollbar-input-event');
      expect(event.body.value).to.eql(mask);
      expect(event.otelAttributes.value).to.eql(mask);
    });

    it('should scrub input when replay.maskInputOptions is set', async function () {
      instrumenter.configure({ replay: { maskInputOptions: { text: true } } });
      const elem = _getElementById('text-input');

      const domEvent = new InputEvent('input');
      elem.value = 'radar';
      elem.dispatchEvent(domEvent);

      await wait(wait_ms);

      expect(telemeter.queue.length).to.eql(1);
      const event = telemeter.queue[0];
      expect(event.type).to.eql('dom');
      expect(event.body.type).to.eql('rollbar-input-event');
      expect(event.body.value).to.eql(mask);
      expect(event.otelAttributes.value).to.eql(mask);
    });

    it('should not scrub input when replay.maskInputOptions is not set', async function () {
      instrumenter.configure({ replay: { maskInputOptions: { text: false } } });
      const elem = _getElementById('text-input');

      const domEvent = new InputEvent('input');
      elem.value = 'radar';
      elem.dispatchEvent(domEvent);

      await wait(wait_ms);

      expect(telemeter.queue.length).to.eql(1);
      const event = telemeter.queue[0];
      expect(event.type).to.eql('dom');
      expect(event.body.type).to.eql('rollbar-input-event');
      expect(event.body.value).to.eql('radar');
      expect(event.otelAttributes.value).to.eql('radar');
    });

    it('should scrub input when telemetryScrubber is set', async function () {
      let description;
      const customScrubber = (desc) => {
        description = desc;
        return true;
      };
      instrumenter.configure({ telemetryScrubber: customScrubber });
      const elem = _getElementById('text-input');

      const domEvent = new InputEvent('input');
      elem.value = 'radar';
      elem.dispatchEvent(domEvent);

      await wait(wait_ms);

      expect(telemeter.queue.length).to.eql(1);
      const event = telemeter.queue[0];
      expect(event.type).to.eql('dom');
      expect(event.body.type).to.eql('rollbar-input-event');
      expect(event.body.value).to.eql(mask);
      expect(event.otelAttributes.value).to.eql(mask);

      expect(description.tagName).to.eql('input');
      expect(description.id).to.eql('text-input');
      expect(description.classes).to.eql(['rb-scrub']);
      expect(description.attributes).to.eql([
        { key: 'type', value: 'text' },
        { key: 'name', value: 'secret' },
      ]);
    });

    it('should scrub input when replay.maskInputFn is set', async function () {
      let value, element;
      const maskFn = (v, e) => {
        value = v;
        element = e;
        return 'masked!';
      };
      instrumenter.configure({
        replay: { maskInputOptions: { text: true }, maskInputFn: maskFn },
      });
      const elem = _getElementById('text-input');

      const domEvent = new InputEvent('input');
      elem.value = 'radar';
      elem.dispatchEvent(domEvent);

      await wait(wait_ms);

      expect(telemeter.queue.length).to.eql(1);
      const event = telemeter.queue[0];
      expect(event.type).to.eql('dom');
      expect(event.body.type).to.eql('rollbar-input-event');
      expect(event.body.value).to.eql('masked!');
      expect(event.otelAttributes.value).to.eql('masked!');

      expect(value).to.eql('radar');
      expect(element).to.eql(elem);
    });
  });
});

/**
 * Creates an Instrumenter wired to a stub telemeter and mock window.
 *
 * @param telemeter - Stub with the capture methods the test exercises,
 *   e.g. `{ captureNetwork }` or `{ captureLog }`.
 * @param windowMock - Mock window whose globals get instrumented.
 * @returns The Instrumenter; call the relevant `instrument*()` method on it.
 */
function createInstrumenter(telemeter, windowMock) {
  return new Instrumenter(
    { scrubFields: [] },
    telemeter,
    { wrap: () => {}, client: { notifier: { diagnostic: {} } } },
    windowMock,
  );
}

function _getElementById(id: string) {
  return document.getElementById(id) as HTMLElement & { value?: string };
}
