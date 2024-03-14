/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var RateLimiter = require('../src/rateLimiter');

describe('RateLimiter()', function () {
  it('should have all of the expected methods', function (done) {
    var options = {};
    var rateLimiter = new RateLimiter(options);
    expect(rateLimiter).to.have.property('configureGlobal');
    expect(rateLimiter).to.have.property('shouldSend');

    done();
  });

  it('should have global properties', function (done) {
    var options = {};
    var rateLimiter = new RateLimiter(options);
    expect(RateLimiter).to.have.property('globalSettings');
    var now = new Date().getTime();
    expect(RateLimiter.globalSettings.startTime).to.be.within(
      now - 1000,
      now + 1000,
    );
    expect(RateLimiter.globalSettings.maxItems).to.not.be.ok();

    done();
  });

  it('should set the global options', function (done) {
    var options = {
      startTime: 1,
      maxItems: 50,
      itemsPerMinute: 102,
      fake: 'stuff',
    };
    var rateLimiter = new RateLimiter(options);
    expect(RateLimiter.globalSettings.startTime).to.be.eql(1);
    expect(RateLimiter.globalSettings.maxItems).to.be.eql(50);
    expect(RateLimiter.globalSettings.itemsPerMinute).to.be.eql(102);
    expect(RateLimiter.globalSettings.fake).to.not.be.eql('stuff');

    done();
  });
});

describe('shouldSend', function () {
  it('should say to send if item says ignore', function (done) {
    var now = new Date().getTime();
    var options = { startTime: now, maxItems: 4, itemsPerMinute: 2 };
    var rateLimiter = new RateLimiter(options);

    var item = { ignoreRateLimit: true };
    var result = rateLimiter.shouldSend(item);
    expect(result.shouldSend).to.be.ok();

    done();
  });

  it('should say not to send if over the per minute limit', function (done) {
    var now = new Date().getTime();
    var options = { startTime: now, maxItems: 4, itemsPerMinute: 2 };
    var rateLimiter = new RateLimiter(options);

    var i1 = { a: 1 };
    var i2 = { a: 2 };
    var i3 = { a: 3 };
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

  it('should reset the per minute limit', function (done) {
    var now = new Date().getTime();
    var options = { startTime: now, maxItems: 4, itemsPerMinute: 2 };
    var rateLimiter = new RateLimiter(options);

    var i1 = { a: 1 };
    var i2 = { a: 2 };
    var i3 = { a: 3 };
    var result1 = rateLimiter.shouldSend(i1, now + 1);
    var result2 = rateLimiter.shouldSend(i2, now + 2);
    var result3 = rateLimiter.shouldSend(i3, now + 60000 + 1);

    expect(result1.shouldSend).to.be.ok();
    expect(result2.shouldSend).to.be.ok();

    expect(result3.shouldSend).to.be.ok();
    expect(result3.error).to.not.be.ok();

    done();
  });

  it('should not send and give us a payload when the maxItems limit is reached', function (done) {
    var now = new Date().getTime();
    var options = { startTime: now, maxItems: 3, itemsPerMinute: 2 };
    var rateLimiter = new RateLimiter(options);

    var i1 = { a: 1 };
    var i2 = { a: 2 };
    var i3 = { a: 3 };
    var i4 = { a: 4 };
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
    expect(result4.payload.body.message.extra.maxItems).to.eql(
      options.maxItems,
    );

    done();
  });

  it('should not send and give an error when over maxItems limit', function (done) {
    var now = new Date().getTime();
    var options = { startTime: now, maxItems: 3, itemsPerMinute: 2 };
    var rateLimiter = new RateLimiter(options);

    var i1 = { a: 1 };
    var i2 = { a: 2 };
    var i3 = { a: 3 };
    var i4 = { a: 4 };
    var i5 = { a: 5 };
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
