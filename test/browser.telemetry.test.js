import { expect } from 'chai';
import sinon from 'sinon';
import Telemeter from '../src/telemetry.js';
import Tracing from '../src/tracing/tracing.js';
import Instrumenter from '../src/browser/telemetry.js';
import Rollbar from '../src/browser/core.js';
import { loadHtml } from './util/fixtures.js';

describe('instrumentNetwork', function () {
  it('should capture XHR requests with string URL', function (done) {
    var callback = sinon.spy();
    var windowMock = {
      XMLHttpRequest: function () {},
    };

    windowMock.XMLHttpRequest.prototype.open = function () {};
    windowMock.XMLHttpRequest.prototype.send = function () {};

    var i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();

    var xhr = new windowMock.XMLHttpRequest();
    xhr.open('GET', 'http://first.call');
    xhr.send();
    xhr.onreadystatechange();

    expect(callback.callCount).to.eql(1);
    expect(callback.args[0][0].url).to.eql('http://first.call');

    i.deinstrumentNetwork();
    i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();
    var xhr = new windowMock.XMLHttpRequest();
    xhr.open('GET', new URL('http://second.call'));
    xhr.send();
    xhr.onreadystatechange();
    expect(callback.callCount).to.eql(2);
    expect(callback.args[1][0].url).to.eql('http://second.call/');

    done();
  });

  it('should capture XHR requests with string URL', function (done) {
    var callback = sinon.spy();
    var windowMock = {
      fetch: function () {
        return Promise.resolve();
      },
    };

    var i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();

    windowMock.fetch('http://first.call');
    expect(callback.callCount).to.eql(1);
    expect(callback.args[0][0].url).to.eql('http://first.call');

    i.deinstrumentNetwork();
    i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();

    windowMock.fetch(new URL('http://second.call'));
    expect(callback.callCount).to.eql(2);
    expect(callback.args[1][0].url).to.eql('http://second.call/');

    done();
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
    ((options = { scrubFields, autoInstrument: { log: false } }),
      (rollbar = new Rollbar({})));
    tracing = new Tracing(window, null, {});
    tracing.initSession();
    telemeter = new Telemeter({}, tracing);
    instrumenter = new Instrumenter(options, telemeter, rollbar, window);
    instrumenter.instrument();
  });

  it('should handle select type input events', async function () {
    const elem = document.getElementById('fruit-select');

    let domEvent = new InputEvent('input');
    elem.value = 'orange';
    elem.dispatchEvent(domEvent);

    await wait(wait_ms);

    expect(telemeter.queue.length).to.eql(1);
    const event = telemeter.queue[0];
    expect(event.type).to.eql('dom');
    expect(event.body.type).to.eql('rollbar-input-event');
    expect(event.body.subtype).to.eql('select');
    expect(event.body.element).to.match(
      /select#fruit-select\[name=\"selectedFruit\"\]/,
    );
    expect(event.body.value).to.eql('orange');

    expect(event.otelAttributes.type).to.eql('select');
    expect(event.otelAttributes.isSynthetic).to.eql(true);
    expect(event.otelAttributes.element).to.match(
      /select#fruit-select\[name=\"selectedFruit\"\]/,
    );
    expect(event.otelAttributes.value).to.eql('orange');
    expect(event.otelAttributes.endTimeUnixNano[0]).to.be.a('number');
    expect(event.otelAttributes.endTimeUnixNano[1]).to.be.a('number');
  });

  it('should handle checkbox type input events', async function () {
    const elem = document.getElementById('remember-me-checkbox');

    const pointerOptions = {
      pointerId: 1,
      bubbles: true,
      cancelable: true,
      pointerType: 'touch',
      isPrimary: true,
    };
    let domEvent = new PointerEvent('click', pointerOptions);
    //elem.value = 'on';
    elem.dispatchEvent(domEvent);

    await wait(wait_ms);

    expect(telemeter.queue.length).to.eql(1);
    const event = telemeter.queue[0];
    expect(event.type).to.eql('dom');
    expect(event.body.type).to.eql('rollbar-input-event');
    expect(event.body.subtype).to.eql('checkbox');
    expect(event.body.element).to.match(
      /input#remember-me-checkbox\[type=\"checkbox\"\]/,
    );
    expect(event.body.value).to.eql(true);

    expect(event.otelAttributes.type).to.eql('checkbox');
    expect(event.otelAttributes.isSynthetic).to.eql(false);
    expect(event.otelAttributes.element).to.match(
      /input#remember-me-checkbox\[type=\"checkbox\"\]/,
    );
    expect(event.otelAttributes.value).to.eql(true);
    expect(event.otelAttributes.endTimeUnixNano[0]).to.be.a('number');
    expect(event.otelAttributes.endTimeUnixNano[1]).to.be.a('number');
  });

  it('should handle textarea type input events', async function () {
    const elem = document.getElementById('textarea-1');

    let domEvent = new InputEvent('input');
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
    const elem = document.getElementById('password-input');

    let domEvent = new InputEvent('input');
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
    const draggable = document.getElementById('draggable');
    const dropzone = document.getElementById('dropzone');

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
    const elem = document.getElementById('button-1');

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
    const elem = document.getElementById('text-input');

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
      /input#text-input.rb-scrub\[type=\"text\"\]/,
    );
    expect(event.body.value).to.eql('abc');

    expect(event.otelAttributes.type).to.eql('text');
    expect(event.otelAttributes.isSynthetic).to.eql(true);
    expect(event.otelAttributes.element).to.match(
      /input#text-input.rb-scrub\[type=\"text\"\]/,
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
      const elem = document.getElementById('text-input');

      let domEvent = new InputEvent('input');
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
      const elem = document.getElementById('text-input');

      let domEvent = new InputEvent('input');
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
      const elem = document.getElementById('text-input');

      let domEvent = new InputEvent('input');
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
      const elem = document.getElementById('text-input');

      let domEvent = new InputEvent('input');
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
      const elem = document.getElementById('text-input');

      let domEvent = new InputEvent('input');
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
      const elem = document.getElementById('text-input');

      let domEvent = new InputEvent('input');
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
      const elem = document.getElementById('text-input');

      let domEvent = new InputEvent('input');
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
      const elem = document.getElementById('text-input');

      let domEvent = new InputEvent('input');
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
      const elem = document.getElementById('text-input');

      let domEvent = new InputEvent('input');
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
      const elem = document.getElementById('text-input');

      let domEvent = new InputEvent('input');
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

function createInstrumenter(callback, windowMock) {
  return new Instrumenter(
    { scrubFields: [] },
    { captureNetwork: callback },
    { wrap: function () {}, client: { notifier: { diagnostic: {} } } },
    windowMock,
  );
}
