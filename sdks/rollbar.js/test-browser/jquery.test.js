var $ = window.jQuery;
window._rollbarConfig = {
  accessToken: 'XXX',
  rollbarJsUrl: '/dist/rollbar.js'
};

require('jquery-mockjax')($, window);
require('../src/bundles/rollbar.snippet.js');
require('../src/plugins/jquery.js');

it('should call the second attached callback', function() {
  // Variable to store result;
  var result;

  // Create an element
  var $div = $('<div></div>');

  // Create a callback function creator
  var result = [];
  var makeCallback = function(number) {
    return function() {
      result.push(number);
    };
  }

  // Create two seperate callback functions.
  var func1 = makeCallback(1);
  var func2 = makeCallback(2);

  // This returns true, despite them being completely different functions
  // that have the same signature.
  // console.log(func1.toString() === func2.toString());

  // Add the first event handler to the click
  $div.on('click', func1);

  // Add the second event handler to the click
  $div.on('click', func2);

  // Remove the first event handler from the click
  $div.off('click', func1);        

  // Trigger the click event
  $div.trigger('click');

  // Expect the result to equal the second callback that should still
  // be attached.
  expect(result).to.eql([2]);
});    

it('should collect ajax fields', function(done) {
  this.timeout(1000);

  var url = 'asdf';
  var method = 'PUT';
    
  var mock = [];
  var origRollbarPayloadQueue = window._rollbarPayloadQueue;
  window._rollbarPayloadQueue = mock;

  var responseText = 'Unknown error';
  var statusText = 'Oops';
  $.mockjax({
    url: url,
    type: method,
    status: 500,
    statusText: statusText,
    responseText: responseText
  });

  $.ajax({url: url, type: method});

  $.mockjax.clear();

  setTimeout(function() {
    var body = mock[0].payload.data.body;
    expect(body.message.body).to.equal(statusText);
    expect(body.message.extra.url).to.equal(url);
    expect(body.message.extra.type).to.equal(method);
    expect(body.message.extra.status).to.equal(500);
    expect(body.message.extra.jqXHR_statusText).to.equal(statusText);
    expect(body.message.extra.jqXHR_responseText).to.equal(responseText);

    window._rollbarPayloadQueue = origRollbarPayloadQueue;

    done();
  }, 500);
});
