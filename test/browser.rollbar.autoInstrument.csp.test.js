import { expect } from 'chai';
import sinon from 'sinon';

import { setTimeout } from './util/timers.js';

import Rollbar from '../src/browser/rollbar.js';

describe('options.autoInstrument', function () {
  describe('contentSecurityPolicy', function () {
    let rollbar = null;

    beforeEach(function () {
      rollbar = window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        autoInstrument: {
          log: false,
          contentSecurityPolicy: true,
          errorOnContentSecurityPolicy: true,
        },
      });
    });

    afterEach(function () {
      window.rollbar.configure({
        autoInstrument: false,
        captureUncaught: false,
      });
    });

    it('should report content security policy errors', async function () {
      const queue = rollbar.client.notifier.queue;
      const queueStub = sinon.stub(queue, '_makeApiRequest');

      // Manually trigger a CSP violation event,
      // since WTR+Mocha will capture the rejection from loadHtml.
      const cspEvent = new SecurityPolicyViolationEvent(
        'securitypolicyviolation',
        {
          blockedURI: 'https://example.com/v3/',
          violatedDirective: 'script-src',
          effectiveDirective: 'script-src',
          originalPolicy: "default-src 'self' 'unsafe-inline' 'unsafe-eval';",
          sourceFile: window.location.href,
          lineNumber: 1,
          columnNumber: 1,
        },
      );

      document.dispatchEvent(cspEvent);

      await setTimeout(100);

      expect(queueStub.called).to.be.true;
      const item = queueStub.getCall(0).args[0];
      const message = item.body.message.body;
      const telemetry = item.body.telemetry[0];

      expect(message).to.match(/Security Policy Violation/);
      expect(message).to.match(/blockedURI: https:\/\/example.com\/v3\//);
      expect(message).to.match(/violatedDirective: script-src/);
      expect(message).to.match(
        /originalPolicy: default-src 'self' 'unsafe-inline' 'unsafe-eval';/,
      );

      expect(telemetry.level).to.eql('error');
      expect(telemetry.type).to.eql('log');
      expect(telemetry.body.message).to.match(/Security Policy Violation/);
      expect(telemetry.body.message).to.match(
        /blockedURI: https:\/\/example.com\/v3\//,
      );
      expect(telemetry.body.message).to.match(/violatedDirective: script-src/);
      expect(telemetry.body.message).to.match(
        /originalPolicy: default-src 'self' 'unsafe-inline' 'unsafe-eval';/,
      );
    });
  });
});
