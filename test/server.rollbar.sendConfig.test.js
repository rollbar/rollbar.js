import { expect } from 'chai';
import sinon from 'sinon';

import Rollbar from '../src/server/rollbar.js';

/**
 * Sends one item through the full server pipeline and resolves with the
 * payload data handed to the API, i.e. exactly what would go over the wire.
 */
function sendAndCapture(options) {
  const rollbar = new Rollbar({
    accessToken: 'abc123',
    captureUncaught: false,
    captureUnhandledRejections: false,
    ...options,
  });
  const api = rollbar.client.notifier.queue.api;
  let sent;
  const stub = sinon.stub(api, 'postItem').callsFake((data, callback) => {
    sent = data;
    callback(null, {});
  });

  return new Promise((resolve, reject) => {
    rollbar.error('sendConfig test', (err) => {
      stub.restore();
      if (err) {
        return reject(err);
      }
      resolve(sent);
    });
  });
}

// https://github.com/rollbar/rollbar.js/issues/1085
describe('server sendConfig', function () {
  const secretOptions = {
    payload: { person: { id: 1, email: 'user@example.com' } },
    password: 'hunter2',
  };

  it('does not send configured_options when sendConfig is false', async function () {
    const data = await sendAndCapture({ ...secretOptions, sendConfig: false });

    expect(data.notifier).to.not.have.property('configured_options');
    expect(data.custom || {}).to.not.have.property('_rollbarConfig');
    expect(JSON.stringify(data.notifier)).to.not.include('hunter2');
    expect(JSON.stringify(data.notifier)).to.not.include('user@example.com');
  });

  it('does not send configured_options when sendConfig is not set', async function () {
    const data = await sendAndCapture(secretOptions);

    expect(data.notifier).to.not.have.property('configured_options');
  });

  it('scrubs configured_options when sendConfig is true', async function () {
    const data = await sendAndCapture({ ...secretOptions, sendConfig: true });
    const configured = data.notifier.configured_options;

    expect(configured.sendConfig).to.equal(true);
    expect(configured).to.not.have.property('accessToken');
    expect(configured.password).to.match(/^\*+$/);
  });

  it('lets a user transform remove configured_options', async function () {
    const data = await sendAndCapture({
      ...secretOptions,
      sendConfig: true,
      transform: (payload) => {
        delete payload.notifier.configured_options;
      },
    });

    expect(data.notifier).to.not.have.property('configured_options');
  });
});
