/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Queue = require('../src/queue');

function TestRateLimiterGenerator() {
  var TestRateLimiter = function() {
    this.shouldSendValue = true;
    this.handler = null;
  };

  TestRateLimiter.prototype.shouldSend = function(item) {
    if (this.handler && typeof this.handler === 'function') {
      return this.handler(item);
    }
    return this.shouldSendValue;
  };

  return TestRateLimiter;
}

function TestApiGenerator() {
  var TestApi = function(handler) {
    this.handler = handler;
  };

  TestApi.prototype.postItem = function(item, callback) {
    if (this.handler && typeof this.handler === 'function') {
      this.handler(item, callback);
    } else {
      if (callback && typeof callback === 'function') {
        callback(new Error('BROKEN'), null);
      }
    }
  };

  TestApi.prototype.configure = function() {};

  return TestApi;
}

function TestLoggerGenerator() {
  var TestLogger = function() {
    this.calls = {
      log: [],
      error: [],
      info: []
    };
  };
  TestLogger.prototype.log = function() {
    this.calls.log.push(arguments);
  };
  TestLogger.prototype.error = function() {
    this.calls.error.push(arguments);
  };
  TestLogger.prototype.info = function() {
    this.calls.info.push(arguments);
  };
  return TestLogger;
};


describe('Queue()', function() {
  it('should have all of the expected methods', function(done) {
    var rateLimiter = new (TestRateLimiterGenerator())();
    var api = new (TestApiGenerator())();
    var logger = new (TestLoggerGenerator())();
    var options = {};
    var queue = new Queue(rateLimiter, api, logger, options);
    expect(queue).to.have.property('configure');
    expect(queue).to.have.property('addPredicate');
    expect(queue).to.have.property('addItem');
    expect(queue).to.have.property('wait');

    done();
  });
});

describe('configure', function() {
  it('should update the options', function(done) {
    var rateLimiter = new (TestRateLimiterGenerator())();
    var api = new (TestApiGenerator())();
    var logger = new (TestLoggerGenerator())();
    var options = {a: 1, b: 42};
    var queue = new Queue(rateLimiter, api, logger, options);

    expect(queue.options.a).to.eql(1);
    expect(queue.options.b).to.eql(42);

    queue.configure({a: 2, c: 15});

    expect(queue.options.a).to.eql(2);
    expect(queue.options.b).to.eql(42);
    expect(queue.options.c).to.eql(15);

    done();
  });
});

describe('addItem', function() {
  describe('not rate limited', function() {
    describe('api success', function() {
      it('should work with no callback', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(i).to.eql(item);
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
          done();
        };
        queue.addItem({mykey: 'myvalue'});
      });
      it('should work with a garbage callback', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(i).to.eql(item);
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
          done();
        };
        queue.addItem({mykey: 'myvalue'}, 'woops');
      });
      it('should work with no predicates', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(i).to.eql(item);
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
        };
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(resp).to.eql(serverResponse);
          done(err);
        });
      });
      it('should call the logger if an error is about to be logged', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {verbose: true};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {body: {trace: {exception: {message: 'hello'}}}};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(i).to.eql(item);
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
        };
        queue.addItem(item, function(err, resp) {
          expect(resp).to.eql(serverResponse);
          expect(logger.calls.error[0][0]).to.eql('hello');
          done(err);
        });
      });
      it('should call the logger if a message is about to be logged', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {verbose: true};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {body: {message: {body: 'hello'}}};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(i).to.eql(item);
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
        };
        queue.addItem(item, function(err, resp) {
          expect(resp).to.eql(serverResponse);
          expect(logger.calls.log[0][0]).to.eql('hello');
          done(err);
        });
      });
      it('should not call the logger if verbose is false', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {verbose: false};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {body: {message: {body: 'hello'}}};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(i).to.eql(item);
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
        };
        queue.addItem(item, function(err, resp) {
          expect(resp).to.eql(serverResponse);
          expect(logger.calls.log.length).to.eql(0);
          done(err);
        });
      });
      it('should stop if a predicate returns false', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(false).to.be.ok();
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(false).to.be.ok();
          cb(null, serverResponse);
        };
        queue.addPredicate(function(i, s) {
          return false;
        });
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(resp).to.not.be.ok();
          done(err);
        });
      });
      it('should stop if a predicate returns an error', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(false).to.be.ok();
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(false).to.be.ok();
          cb(null, serverResponse);
        };
        var predicateError = 'bork bork';
        queue.addPredicate(function(i, s) {
          return {err: predicateError};
        });
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(err).to.eql(predicateError);
          expect(resp).to.not.be.ok();
          done();
        });
      });
      it('should stop if any predicate returns an error', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(false).to.be.ok();
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(false).to.be.ok();
          cb(null, serverResponse);
        };
        var predicateError = 'bork bork';
        queue.addPredicate(function(i, s) {
          return true;
        }).addPredicate(function(i, s) {
          return {err: predicateError};
        }).addPredicate(function(i, s) {
          return true;
        });
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(err).to.eql(predicateError);
          expect(resp).to.not.be.ok();
          done();
        });
      });
      it('should call wait if set', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(false).to.be.ok();
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(false).to.be.ok();
          cb(null, serverResponse);
        };
        queue.wait(function() {
          done();
        });
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(resp).to.be.ok();
        });
      });
      it('should work if wait is called with a non-function', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          cb(null, serverResponse);
        };
        queue.wait({});
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(resp).to.be.ok();
          done(err);
        });
      });
      it('should work if all predicates return true', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var serverResponse = {success: true};

        rateLimiter.handler = function(i) {
          expect(i).to.eql(item);
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
        };
        queue.addPredicate(function(i, s) {
          return true;
        }).addPredicate(function() {
          return true;
        });
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(resp).to.eql(serverResponse);
          done(err);
        });
      });
    });
    describe('api failure', function() {
      it('should callback if the api throws an exception', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var exception = 'boom!';

        rateLimiter.handler = function(i) {
          expect(i).to.eql(item);
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          throw exception;
        };
        queue.addPredicate(function(i, s) {
          return true;
        }).addPredicate(function() {
          return true;
        });
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(resp).to.not.be.ok();
          expect(err).to.eql(exception);
          done();
        });
      });
      it('should callback with the api error if not retriable', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {retryInterval: 1};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var apiError = {code: 'NOPE', message: 'borked'};

        rateLimiter.handler = function(i) {
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          cb(apiError);
        };
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(err).to.eql(apiError);
          expect(resp).to.not.be.ok();
          done();
        });
      });
      it('should callback with the api error if no retryInterval is set', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var apiError = {code: 'ENOTFOUND', message: 'No internet connection'};

        rateLimiter.handler = function(i) {
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          cb(apiError);
        };
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(err).to.eql(apiError);
          expect(resp).to.not.be.ok();
          done();
        });
      });
      it('should retry if we get a retriable error', function(done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = {retryInterval: 1};
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = {mykey: 'myvalue'};
        var serverResponse = {success: true};
        var apiError = {code: 'ENOTFOUND', message: 'No internet connection'};

        var apiRequestCount = 0;
        rateLimiter.handler = function(i) {
          return {error: null, shouldSend: true, payload: null};
        };
        api.handler = function(i, cb) {
          apiRequestCount++;
          if (apiRequestCount === 1) {
            cb(apiError);
          } else {
            cb(null, serverResponse);
          }
        };
        queue.addItem({mykey: 'myvalue'}, function(err, resp) {
          expect(err).to.not.be.ok();
          expect(resp).to.eql(serverResponse);
          expect(apiRequestCount).to.eql(2);
          done();
        });
      });
    });
  });
  describe('rate limited', function() {
    it('should callback if the rate limiter says not to send and has an error', function(done) {
      var rateLimiter = new (TestRateLimiterGenerator())();
      var api = new (TestApiGenerator())();
      var logger = new (TestLoggerGenerator())();
      var options = {};
      var queue = new Queue(rateLimiter, api, logger, options);

      var item = {mykey: 'myvalue'};
      var rateLimitError = 'bork';

      rateLimiter.handler = function(i) {
        expect(i).to.eql(item);
        return {error: rateLimitError, shouldSend: false, payload: null};
      };
      api.handler = function(i, cb) {
        cb(null, 'Good times');
      };
      queue.addPredicate(function(i, s) {
        return true;
      }).addPredicate(function() {
        return true;
      });
      queue.addItem({mykey: 'myvalue'}, function(err, resp) {
        expect(resp).to.not.be.ok();
        expect(err).to.eql(rateLimitError);
        done();
      });
    });
    it('should callback if the rate limiter says not to send and has a payload', function(done) {
      var rateLimiter = new (TestRateLimiterGenerator())();
      var api = new (TestApiGenerator())();
      var logger = new (TestLoggerGenerator())();
      var options = {};
      var queue = new Queue(rateLimiter, api, logger, options);

      var item = {mykey: 'myvalue'};
      var rateLimitPayload = {something: 'went wrong'};
      var serverResponse = {message: 'good times'};

      rateLimiter.handler = function(i) {
        expect(i).to.eql(item);
        return {error: null, shouldSend: false, payload: rateLimitPayload};
      };
      api.handler = function(i, cb) {
        expect(i).to.eql(rateLimitPayload);
        cb(null, serverResponse);
      };
      queue.addPredicate(function(i, s) {
        return true;
      }).addPredicate(function() {
        return true;
      });
      queue.addItem({mykey: 'myvalue'}, function(err, resp) {
        expect(resp).to.eql(serverResponse);
        expect(err).to.not.be.ok();
        done();
      });
    });
  });
});

