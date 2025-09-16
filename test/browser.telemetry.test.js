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
  let tracing, telemeter, instrumenter, rollbar, scrubFields;
  const wait = t => new Promise(resolve => setTimeout(resolve, t));

  beforeEach(async function () {
    await loadHtml('test/fixtures/html/dom-events.html');
    scrubFields = ['foo', 'bar'];
    rollbar = new Rollbar({})
    tracing = new Tracing(window, {})
    tracing.initSession();
    telemeter = new Telemeter({}, tracing);
    instrumenter = new Instrumenter(
      {scrubFields, autoInstrument: {log: false}},
      telemeter,
      rollbar,
      window
    );
    instrumenter.instrument();
  });

  it('should handle drag drop events', async function () {
    const draggable = document.getElementById("draggable");
    const dropzone = document.getElementById("dropzone");
    console.log('elements', draggable, dropzone);

    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', 'some data');

    const dragEvent = new DragEvent('dragstart', { dataTransfer: dataTransfer });
    draggable.dispatchEvent(dragEvent);

    const dragOverEvent = new DragEvent('dragover', {
      dataTransfer: dataTransfer,
      bubbles: true,
      cancelable: true
    });
    dragOverEvent.preventDefault = () => {};
    dropzone.dispatchEvent(dragOverEvent);

    const dropEvent = new DragEvent('drop', {
      dataTransfer: dataTransfer,
      bubbles: true,
      cancelable: true
    });
    dropEvent.preventDefault = () => {};
    dropzone.dispatchEvent(dropEvent);

    await wait(1000);

    console.log('telemeter queue', telemeter.queue);
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
    const elem = document.getElementById("button-1");

    const pointerOptions = {
      pointerId: 1,
      bubbles: true,
      cancelable: true,
      pointerType: "touch",
      isPrimary: true,
    }
    let domEvent = new PointerEvent('click', pointerOptions);
    elem.dispatchEvent(domEvent);

    domEvent = new PointerEvent('click', pointerOptions);
    elem.dispatchEvent(domEvent);

    domEvent = new PointerEvent('click', pointerOptions);
    elem.dispatchEvent(domEvent);

    await wait(1000);

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
  });

  it('should combine repeated input events', async function () {
    const elem = document.getElementById("text-input");

    let domEvent = new InputEvent('input');
    elem.value = 'a';
    elem.dispatchEvent(domEvent);

    domEvent = new InputEvent('input');
    elem.value = 'ab';
    elem.dispatchEvent(domEvent);

    domEvent = new InputEvent('input');
    elem.value = 'abc';
    elem.dispatchEvent(domEvent);

    await wait(1000);

    expect(telemeter.queue.length).to.eql(1);
    const event = telemeter.queue[0];
    expect(event.type).to.eql('dom');
    expect(event.body.type).to.eql('rollbar-input-event');
    expect(event.body.subtype).to.eql('text');
    expect(event.body.element).to.match(/input#text-input\[type=\"text\"\]/);
    expect(event.body.value).to.eql('abc');

    expect(event.otelAttributes.type).to.eql('text');
    expect(event.otelAttributes.isSynthetic).to.eql(true);
    expect(event.otelAttributes.element).to.match(/input#text-input\[type=\"text\"\]/);
    expect(event.otelAttributes.value).to.eql('abc');
    expect(event.otelAttributes.endTimeUnixNano[0]).to.be.a('number');
    expect(event.otelAttributes.endTimeUnixNano[1]).to.be.a('number');
    expect(event.otelAttributes.count).to.eql(3);
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
