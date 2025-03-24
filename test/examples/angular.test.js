/* globals expect */
/* globals describe */
/* globals it */

// Import Rollbar directly from the source
var Rollbar = require('../../dist/rollbar.umd.js');

describe('Angular integration', function () {
  // Utility function to create a test-enabled Rollbar instance
  function createTestRollbar(capturePayload) {
    var rollbar = new Rollbar({
      accessToken: 'ROLLBAR_POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      // Override logging to test
      autoInstrument: false,
      // Override endpoint to prevent actual API calls
      endpoint: 'https://test.example.com/api',
      // Set log level to debug to catch all messages
      logLevel: 'debug'
    });

    // Override the actual API call with our test hook
    var originalQueue = rollbar.client.queue.addItem;
    rollbar.client.queue.addItem = function(item, callback) {
      // Capture the payload for verification
      capturePayload(item);
      // Call the original to maintain proper behavior
      return originalQueue.call(this, item, callback);
    };

    return rollbar;
  }

  it('should correctly configure Rollbar with Angular config options', function () {
    // Verify the integration by evaluating the Rollbar configuration pattern
    var config = {
      accessToken: 'ROLLBAR_POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment: 'production'
    };

    // Initialize Rollbar like the Angular app would
    var rollbar = new Rollbar(config);

    // Check that Rollbar was initialized correctly
    expect(rollbar.options.accessToken).to.equal('ROLLBAR_POST_CLIENT_ITEM_TOKEN');
    expect(rollbar.options.captureUncaught).to.equal(true);
    expect(rollbar.options.captureUnhandledRejections).to.equal(true);
  });

  it('should process and send errors with correct data', function() {
    var processedItem = null;

    // Create a Rollbar instance with our test hook
    var rollbar = createTestRollbar(function(item) {
      processedItem = item;
    });

    // Create a test error
    var testError = new Error('Test Angular Error');
    var customData = { component: 'TestComponent' };

    // Call error method
    rollbar.error(testError, customData);

    // Verify the error was processed
    expect(processedItem).to.not.equal(null);

    // Verify the error level is set correctly
    expect(processedItem.level).to.equal('error');

    // Verify the error message is included
    expect(processedItem.body.trace.exception.message).to.equal('Test Angular Error');

    // Verify custom data is included
    expect(processedItem.custom.component).to.equal('TestComponent');
  });

  it('should process and send warnings with correct data', function() {
    var processedItem = null;

    // Create a Rollbar instance with our test hook
    var rollbar = createTestRollbar(function(item) {
      processedItem = item;
    });

    // Call warning method
    var warningMessage = 'Test Angular Warning';
    var customData = { severity: 'medium' };

    rollbar.warning(warningMessage, customData);

    // Verify the warning was processed
    expect(processedItem).to.not.equal(null);

    // Verify the warning level is set correctly
    expect(processedItem.level).to.equal('warning');

    // Verify the warning message is included
    expect(processedItem.body.message.body).to.equal('Test Angular Warning');

    // Verify custom data is included
    expect(processedItem.custom.severity).to.equal('medium');
  });

  it('should include Angular-specific properties in error data', function() {
    var processedItem = null;

    // Create a Rollbar instance with our test hook
    var rollbar = createTestRollbar(function(item) {
      processedItem = item;
    });

    // Create an Angular-specific error with ngDebugContext
    var angularError = new Error('Angular Component Error');

    // Create a custom object that includes Angular-specific context
    var customData = {
      ngDebugContext: {
        component: 'TestAngularComponent',
        context: { name: 'AngularContext' }
      }
    };

    // Call error method with the custom data that includes Angular debug context
    rollbar.error(angularError, customData);

    // Verify the error was processed
    expect(processedItem).to.not.equal(null);

    // Verify the error message is included
    expect(processedItem.body.trace.exception.message).to.equal('Angular Component Error');

    // Verify Angular-specific properties are included in custom data
    expect(typeof processedItem.custom.ngDebugContext).to.equal('object');
    expect(processedItem.custom.ngDebugContext.component).to.equal('TestAngularComponent');
    expect(processedItem.custom.ngDebugContext.context.name).to.equal('AngularContext');
  });
});
