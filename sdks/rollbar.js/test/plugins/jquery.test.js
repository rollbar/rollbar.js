var expect = chai.expect;

it("should call the second attached callback", function() {
  // Variable to store result;
  var result;

  // Create an element
  var $div = $("<div></div>");

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
  expect(result).to.deep.equal([2]);
});    


it("should collect method and url for ajax errors", function(done) {
  this.timeout(1000);

  var url = 'asdf';
  var method = 'PUT';
    
  var oldShimQueue = window.RollbarShimQueue;
  var mock = [];
  window.RollbarShimQueue = mock;

  $.mockjax({
    url: url,
    type: method,
    status: 200,
    responseText: '{"err":0}'
  });

  $.ajax({url: url, type: method});

  $.mockjaxClear();

  setTimeout(function() {
    expect(mock[0].msg).to.equal('jQuery ajax error for ' + method + ' ' + url);
    expect(mock[0].jquery_url).to.equal(url);
    expect(mock[0].jquery_type).to.equal(method);
  
    window._rollbar = oldRollbar;

    done();
  }, 500);
});
