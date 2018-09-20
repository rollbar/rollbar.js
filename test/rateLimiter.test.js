/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var RateLimiter = require('../src/rateLimiter');
var Rollbar = require('../src/browser/rollbar');
var TestClientGen = require('./testClient');

describe('RateLimiter()', function() {
  it('should have all of the expected methods', function(done) {
    var options = {};
    var rateLimiter = new RateLimiter(options);
    expect(rateLimiter).to.have.property('configureGlobal');
    expect(rateLimiter).to.have.property('shouldSend');

    done();
  });

  it('should have global properties', function(done) {
    var options = {};
    new RateLimiter(options);
    expect(RateLimiter).to.have.property('globalSettings');
    var now = (new Date()).getTime();
    expect(RateLimiter.globalSettings.startTime).to.be.within(now-1000, now+1000);
    expect(RateLimiter.globalSettings.maxItems).to.not.be.ok();

    done();
  });

  it('should set the global options', function(done) {
    var options = {startTime: 1, maxItems: 50, itemsPerMinute: 102, fake: 'stuff'};
    new RateLimiter(options);
    expect(RateLimiter.globalSettings.startTime).to.be.eql(1);
    expect(RateLimiter.globalSettings.maxItems).to.be.eql(50);
    expect(RateLimiter.globalSettings.itemsPerMinute).to.be.eql(102);
    expect(RateLimiter.globalSettings.fake).to.not.be.eql('stuff');

    done();
  });
});

describe('shouldSend', function() {
  it('should say to send if item says ignore', function(done) {
    var now = (new Date()).getTime();
    var options = {startTime: now, maxItems: 4, itemsPerMinute: 2};
    var rateLimiter = new RateLimiter(options);

    var item = {ignoreRateLimit: true};
    var result = rateLimiter.shouldSend(item);
    expect(result.shouldSend).to.be.ok();

    done();
  });

  var setupDedupeTest = function() {
    var client = new (TestClientGen())();
    var now = (new Date()).getTime();    
    var options = { 
      startTime: now,
      duplicateRateLimit: 5,
    };
    var rollbar = new Rollbar(options, client);
    var rateLimiter = new RateLimiter(options);

    return { rollbar: rollbar, rateLimiter: rateLimiter, client: client };
  };

  var createItem = function(setup, message, exception) {
    setup.rollbar.handleUncaughtException(message, '', 0, 0, exception, null);

    return setup.client.logCalls[setup.client.logCalls.length - 1].item;
  }

  it.only('asdfasdf', function (done) {
    var setup = setupDedupeTest();
    var exception1 = new Error('exception');
    var exception2 = new Error('exception');    
    var item1 = createItem(setup, 'message', exception1);
    var item2 = createItem(setup, 'message', exception2);
    var item3 = createItem(setup, 'message2', exception1);

    // control aka happy path
    // console.log("1")
    expect(setup.rateLimiter.shouldSend(item1, 123123).shouldSend).to.equal(true)

    // same message within in the duplicateRateLimit time (<5ms), do not send
    // console.log("1")
    expect(setup.rateLimiter.shouldSend(item1, 123125).shouldSend).to.equal(false)

    // if the exception and message are the same, but occurs outside the rate limit, send
    // console.log("1")
    expect(setup.rateLimiter.shouldSend(item1, 123130).shouldSend).to.equal(true) 
    
    // if exception is different, but message is the same, send
    expect(setup.rateLimiter.shouldSend(item2, 123125).shouldSend).to.equal(true)
    
    // if exception is the same, but the message is different, send
    expect(setup.rateLimiter.shouldSend(item3, 123125).shouldSend).to.equal(true)

    done()

    // tests: 
    // dedupeErrors - on/off
    // configurable dupe rate (how long are we cacheing error messages for)
    // "happy path": should send is true and it sends the message
    // send same error msg as happy path in a time frame < rate limit - MESSAGE SHOULD NOT SEND
    // turn off dededupe errors. ^ run this one. message should send. 
  });

  it('should say not to send if over the per minute limit', function(done) {
    var now = (new Date()).getTime();
    var options = {startTime: now, maxItems: 4, itemsPerMinute: 2};
    var rateLimiter = new RateLimiter(options);

    var i1 = {a: 1};
    var i2 = {a: 2};
    var i3 = {a: 3};
    var result1 = rateLimiter.shouldSend(i1, now + 1);
    var result2 = rateLimiter.shouldSend(i2, now + 2);
    var result3 = rateLimiter.shouldSend(i3, now + 3);

    expect(result1.shouldSend).to.be.ok();
    expect(result2.shouldSend).to.be.ok();

    expect(result3.shouldSend).to.not.be.ok();
    expect(result3.error).to.not.be.ok();
    expect(result3.payload).to.be.ok();

    done();
  });

  it('should reset the per minute limit', function(done) {
    var now = (new Date()).getTime();
    var options = {startTime: now, maxItems: 4, itemsPerMinute: 2};
    var rateLimiter = new RateLimiter(options);

    var i1 = {a: 1};
    var i2 = {a: 2};
    var i3 = {a: 3};
    var result1 = rateLimiter.shouldSend(i1, now + 1);
    var result2 = rateLimiter.shouldSend(i2, now + 2);
    var result3 = rateLimiter.shouldSend(i3, now + 60000 + 1);

    expect(result1.shouldSend).to.be.ok();
    expect(result2.shouldSend).to.be.ok();

    expect(result3.shouldSend).to.be.ok();
    expect(result3.error).to.not.be.ok();

    done();
  });

  it('should not send and give us a payload when the maxItems limit is reached', function(done) {
    var now = (new Date()).getTime();
    var options = {startTime: now, maxItems: 3, itemsPerMinute: 2};
    var rateLimiter = new RateLimiter(options);

    var i1 = {a: 1};
    var i2 = {a: 2};
    var i3 = {a: 3};
    var i4 = {a: 4};
    var result1 = rateLimiter.shouldSend(i1, now + 1);
    var result2 = rateLimiter.shouldSend(i2, now + 2);
    var result3 = rateLimiter.shouldSend(i3, now + 60000 + 1);
    var result4 = rateLimiter.shouldSend(i4, now + 60000 + 60000 + 1);

    expect(result1.shouldSend).to.be.ok();
    expect(result2.shouldSend).to.be.ok();
    expect(result3.shouldSend).to.be.ok();
    expect(result3.error).to.not.be.ok();

    expect(result4.shouldSend).to.not.be.ok();
    expect(result4.error).to.not.be.ok();
    expect(result4.payload).to.be.ok();
    expect(result4.payload.body.message.extra.maxItems).to.eql(options.maxItems);

    done();
  });

  it('should not send and give an error when over maxItems limit', function(done) {
    var now = (new Date()).getTime();
    var options = {startTime: now, maxItems: 3, itemsPerMinute: 2};
    var rateLimiter = new RateLimiter(options);

    var i1 = {a: 1};
    var i2 = {a: 2};
    var i3 = {a: 3};
    var i4 = {a: 4};
    var i5 = {a: 5};
    var result1 = rateLimiter.shouldSend(i1, now + 1);
    var result2 = rateLimiter.shouldSend(i2, now + 2);
    var result3 = rateLimiter.shouldSend(i3, now + 60000 + 1);
    var result4 = rateLimiter.shouldSend(i4, now + 60000 + 60000 + 1);
    var result5 = rateLimiter.shouldSend(i5, now + 60000 + 60000 + 60000 + 1);

    expect(result1.shouldSend).to.be.ok();
    expect(result2.shouldSend).to.be.ok();

    expect(result3.shouldSend).to.be.ok();
    expect(result3.error).to.not.be.ok();
    expect(result3.payload).to.not.be.ok();

    expect(result4.shouldSend).to.not.be.ok();
    expect(result4.error).to.not.be.ok();
    expect(result4.payload).to.be.ok();

    expect(result5.shouldSend).to.not.be.ok();
    expect(result5.error).to.be.ok();
    expect(result5.payload).to.not.be.ok();

    done();
  });

});

