/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Notifier = require('../src/notifier');

var rollbarConfig = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: true,
};

function TestQueueGenerator() {
  var TestQueue = function () {
    this.items = [];
  };

  TestQueue.prototype.addPendingItem = function () {};
  TestQueue.prototype.removePendingItem = function () {};
  TestQueue.prototype.addItem = function (item, callback) {
    this.items.push({ item: item, callback: callback });
  };

  TestQueue.prototype.configure = function () {};

  return TestQueue;
}

describe('Notifier()', function () {
  it('should have all of the expected methods', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);
    expect(notifier).to.have.property('configure');
    expect(notifier).to.have.property('addTransform');
    expect(notifier).to.have.property('log');

    done();
  });
});

describe('configure', function () {
  it('should update the options', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { someBool: true, other: 'stuff', enabled: true };
    var notifier = new Notifier(queue, options);

    notifier.configure({ other: 'baz' });

    expect(notifier.options.someBool).to.be.ok();
    expect(notifier.options.other).to.eql('baz');

    done();
  });

  it('should pass the updated options to the transform', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { someBool: true, enabled: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    notifier
      .addTransform(function (i, o, cb) {
        expect(o.someBool).to.not.be.ok();
        cb(null, { a: 42, b: i.b });
      })
      .addTransform(function (i, o, cb) {
        expect(o.someBool).to.not.be.ok();
        cb(null, { a: i.a + 1, b: i.b });
      });

    notifier.configure({ someBool: false });

    var spy = sinon.spy();
    notifier.log(initialItem, spy);

    expect(spy.called).to.not.be.ok();
    expect(queue.items.length).to.eql(1);
    expect(queue.items[0].item).to.not.eql(initialItem);
    expect(queue.items[0].item.a).to.eql(43);
    expect(queue.items[0].item.b).to.eql('a string');

    done();
  });
  it('should not add an item if disabled in constructor', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { someBool: true, enabled: false };
    var notifier = new Notifier(queue, options);
    var initialItem = { a: 123, b: 'a string' };
    notifier.log(initialItem);
    expect(queue.items.length).to.eql(0);
    done();
  });
  it('should not add an item if disabled via call to configure', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { someBool: true, enabled: true };
    var notifier = new Notifier(queue, options);
    var initialItem = { a: 123, b: 'a string' };
    notifier.configure({ enabled: false });
    notifier.log(initialItem);
    expect(queue.items.length).to.eql(0);
    done();
  });
});

describe('addTransform', function () {
  it('should not add a non-function', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    expect(notifier.transforms.length).to.eql(0);
    notifier.addTransform('garbage');
    expect(notifier.transforms.length).to.eql(0);

    done();
  });

  it('should add a function', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    expect(notifier.transforms.length).to.eql(0);
    notifier.addTransform(function () {
      return;
    });
    expect(notifier.transforms.length).to.eql(1);

    done();
  });
});

describe('log', function () {
  it('should work without any transforms', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    var spy = sinon.spy();
    notifier.log(initialItem, spy);
    expect(spy.called).to.not.be.ok();
    expect(queue.items.length).to.eql(1);
    expect(queue.items[0].item).to.eql(initialItem);

    done();
  });

  it('should apply the transforms', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    notifier
      .addTransform(function (i, o, cb) {
        cb(null, { a: 42, b: i.b });
      })
      .addTransform(function (i, o, cb) {
        cb(null, { a: i.a + 1, b: i.b });
      });
    var spy = sinon.spy();
    notifier.log(initialItem, spy);

    expect(spy.called).to.not.be.ok();
    expect(queue.items.length).to.eql(1);
    expect(queue.items[0].item).to.not.eql(initialItem);
    expect(queue.items[0].item.a).to.eql(43);
    expect(queue.items[0].item.b).to.eql('a string');

    done();
  });

  it('should stop and callback if a transform errors', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    var error = new Error('fizz buzz');
    notifier
      .addTransform(function (i, o, cb) {
        cb(error, null);
      })
      .addTransform(function (i, o, cb) {
        expect(false).to.be.ok(); // assert this is not called
        cb(null, { a: 42, b: i.b });
      });
    var spy = sinon.spy();
    notifier.log(initialItem, spy);

    expect(spy.called).to.be.ok();
    expect(spy.calledWithExactly(error, null)).to.be.ok();
    expect(queue.items.length).to.eql(0);

    done();
  });

  it('should work without a callback', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    notifier
      .addTransform(function (i, o, cb) {
        cb(new Error('fizz buzz'), null);
      })
      .addTransform(function (i, o, cb) {
        expect(false).to.be.ok(); // assert this is not called
        cb(null, { a: 42, b: i.b });
      });
    notifier.log(initialItem);

    expect(queue.items.length).to.eql(0);

    done();
  });

  it('should pass the options to the transforms', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true, someBool: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    notifier
      .addTransform(function (i, o, cb) {
        expect(o.someBool).to.be.ok();
        cb(null, { a: 42, b: i.b });
      })
      .addTransform(function (i, o, cb) {
        expect(o.someBool).to.be.ok();
        cb(null, { a: i.a + 1, b: i.b });
      });
    var spy = sinon.spy();
    notifier.log(initialItem, spy);

    expect(spy.called).to.not.be.ok();
    expect(queue.items.length).to.eql(1);
    expect(queue.items[0].item).to.not.eql(initialItem);
    expect(queue.items[0].item.a).to.eql(43);
    expect(queue.items[0].item.b).to.eql('a string');

    done();
  });
});
