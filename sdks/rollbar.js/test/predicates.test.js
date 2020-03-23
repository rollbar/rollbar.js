/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var p = require('../src/predicates');
var logger = {
  log: function() {},
  error: function() {}
};

describe('userCheckIgnore', function() {
  it('should return true if no user function', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug'};
    expect(p.userCheckIgnore(logger)(item, settings)).to.be.ok();
  });
  it('should return true if checkIgnore is not a function', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug', checkIgnore: true};
    expect(p.userCheckIgnore(logger)(item, settings)).to.be.ok();
  });
  it('should return true if checkIgnore returns false', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug', checkIgnore: function() {
      return false;
    }};
    expect(p.userCheckIgnore(logger)(item, settings)).to.be.ok();
  });
  it('should return false if checkIgnore returns true', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug', checkIgnore: function() {
      return true;
    }};
    expect(p.userCheckIgnore(logger)(item, settings)).to.not.be.ok();
  });
  it('should return true if checkIgnore throws', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug', checkIgnore: function() {
      throw new Error('bork bork');
    }};
    expect(p.userCheckIgnore(logger)(item, settings)).to.be.ok();
    expect(settings.checkIgnore).to.not.be.ok();
  });
  it('should get the right arguments', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug', checkIgnore: function(isUncaught, args, payload) {
      expect(isUncaught).to.not.be.ok();
      expect(args).to.eql([1,2,3]);
      expect(payload).to.eql(item);
    }};
    expect(p.userCheckIgnore(logger)(item, settings)).to.be.ok();
  });
});

describe('urlIsWhitelisted', function() {
  var item = {
    level: 'critical',
    body: {trace: {frames: [
      {filename: 'http://api.fake.com/v1/something'},
      {filename: 'http://api.example.com/v1/something'},
      {filename: 'http://api.fake.com/v2/something'}
    ]}}
  };
  var traceChainItem = {
    level: 'critical',
    body: {trace_chain: [{frames: [
      {filename: 'http://api.fake.com/v1/something'},
      {filename: 'http://api.example.com/v1/something'},
      {filename: 'http://api.fake.com/v2/something'}
    ]},
    {frames: [
      {filename: 'http://api.fake1.com/v2/something'},
      {filename: 'http://api.example1.com/v2/something'},
      {filename: 'http://api.fake1.com/v3/something'}
    ]}
    ]}
  };
  it('should return true with no whitelist', function() {
    var settings = {
      reportLevel: 'debug'
    };
    expect(p.urlIsWhitelisted(logger)(item, settings)).to.be.ok();
    expect(p.urlIsWhitelisted(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true with no trace', function() {
    var item = {
      level: 'critical',
      body: {message: 'hey'}
    };
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['fake.com', 'example.com']
    };
    expect(p.urlIsWhitelisted(logger)(item, settings)).to.be.ok();
  });
  it('should return true if at least one regex matches at least one filename in the trace', function() {
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['example.com']
    };
    expect(p.urlIsWhitelisted(logger)(item, settings)).to.be.ok();
    expect(p.urlIsWhitelisted(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if the filename is not a string', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: [
        {filename: {url: 'http://api.fake.com/v1/something'}},
        {filename: {url: 'http://api.example.com/v1/something'}},
        {filename: {url: 'http://api.fake.com/v2/something'}},
      ]}}
    };
    var traceChainItem = {
      level: 'critical',
      body: {trace_chain: [{frames: [
        {filename: {url: 'http://api.fake.com/v1/something'}},
        {filename: {url: 'http://api.example.com/v1/something'}},
        {filename: {url: 'http://api.fake.com/v2/something'}},
      ]},
      {frames: [
        {filename: {url: 'http://api.fake.com/v1/something'}},
        {filename: {url: 'http://api.example.com/v1/something'}},
        {filename: {url: 'http://api.fake.com/v2/something'}},
      ]}
      ]}
    };
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['nope.com']
    };
    expect(p.urlIsWhitelisted(logger)(item, settings)).to.be.ok();
    expect(p.urlIsWhitelisted(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if there is no frames key', function() {
    var item = {
      level: 'critical',
      body: {trace: {notframes: []}}
    };
    var traceChainItem = {
      level: 'critical',
      body: {trace_chain: [
        {notframes: []},
        {notframes: []}
      ]}
    };
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['nope.com']
    };
    expect(p.urlIsWhitelisted(logger)(item, settings)).to.be.ok();
    expect(p.urlIsWhitelisted(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if there are no frames', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: []}}
    };
    var traceChainItem = {
      level: 'critical',
      body: {trace_chain: [
        {frames: []},
        {frames: []}
      ]}
    };
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['nope.com']
    };
    expect(p.urlIsWhitelisted(logger)(item, settings)).to.be.ok();
    expect(p.urlIsWhitelisted(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return false if nothing in the whitelist matches', function() {
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['baz\.com', 'foo\.com']
    };
    expect(p.urlIsWhitelisted(logger)(item, settings)).to.not.be.ok();
    expect(p.urlIsWhitelisted(logger)(traceChainItem, settings)).to.not.be.ok();
  });
});

describe('urlIsNotBlacklisted', function() {
  var item = {
    level: 'critical',
    body: {trace: {frames: [
      {filename: 'http://api.fake.com/v1/something'},
      {filename: 'http://api.example.com/v1/something'},
      {filename: 'http://api.fake.com/v2/something'}
    ]}}
  };
  var traceChainItem = {
    level: 'critical',
    body: {trace_chain: [{frames: [
      {filename: 'http://api.fake.com/v1/something'},
      {filename: 'http://api.example.com/v1/something'},
      {filename: 'http://api.fake.com/v2/something'}
    ]},
    {frames: [
      {filename: 'http://api.fake1.com/v2/something'},
      {filename: 'http://api.example1.com/v2/something'},
      {filename: 'http://api.fake1.com/v3/something'}
    ]}
    ]}
  };
  it('should return true with no blacklist', function() {
    var settings = {
      reportLevel: 'debug'
    };
    expect(p.urlIsNotBlacklisted(logger)(item, settings)).to.be.ok();
    expect(p.urlIsNotBlacklisted(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true with no trace', function() {
    var item = {
      level: 'critical',
      body: {message: 'hey'}
    };
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['fake.com', 'other.com']
    };
    expect(p.urlIsNotBlacklisted(logger)(item, settings)).to.be.ok();
  });
  it('should return false if any regex matches at least one filename in the trace', function() {
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['example.com', 'other.com']
    };
    expect(p.urlIsNotBlacklisted(logger)(item, settings)).to.not.be.ok();
    expect(p.urlIsNotBlacklisted(logger)(traceChainItem, settings)).to.not.be.ok();
  });
  it('should return true if the filename is not a string', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: [
        {filename: {url: 'http://api.fake.com/v1/something'}},
        {filename: {url: 'http://api.example.com/v1/something'}},
        {filename: {url: 'http://api.fake.com/v2/something'}},
      ]}}
    };
    var traceChainItem = {
      level: 'critical',
      body: {trace_chain: [{frames: [
        {filename: {url: 'http://api.fake.com/v1/something'}},
        {filename: {url: 'http://api.example.com/v1/something'}},
        {filename: {url: 'http://api.fake.com/v2/something'}},
      ]},
      {frames: [
        {filename: {url: 'http://api.fake.com/v1/something'}},
        {filename: {url: 'http://api.example.com/v1/something'}},
        {filename: {url: 'http://api.fake.com/v2/something'}},
      ]}
      ]}
    };
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['example.com', 'other.com']
    };
    expect(p.urlIsNotBlacklisted(logger)(item, settings)).to.be.ok();
    expect(p.urlIsNotBlacklisted(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if there is no frames key', function() {
    var item = {
      level: 'critical',
      body: {trace: {notframes: []}}
    };
    var traceChainItem = {
      level: 'critical',
      body: {trace_chain: [
        {notframes: []},
        {notframes: []}
      ]}
    };
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['nope.com']
    };
    expect(p.urlIsNotBlacklisted(logger)(item, settings)).to.be.ok();
    expect(p.urlIsNotBlacklisted(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if there are no frames', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: []}}
    };
    var traceChainItem = {
      level: 'critical',
      body: {trace_chain: [
        {frames: []},
        {frames: []}
      ]}
    };
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['nope.com']
    };
    expect(p.urlIsNotBlacklisted(logger)(item, settings)).to.be.ok();
    expect(p.urlIsNotBlacklisted(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if nothing in the blacklist matches', function() {
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['baz\.com', 'foo\.com']
    };
    expect(p.urlIsNotBlacklisted(logger)(item, settings)).to.be.ok();
    expect(p.urlIsNotBlacklisted(logger)(traceChainItem, settings)).to.be.ok();
  });
});

describe('messageIsIgnored', function() {
  it('true if no ignoredMessages setting', function() {
    var item = {
      level: 'critical',
      body: {
        trace: {exception: {message: 'bork bork'}},
        message: {body: 'fuzz'}
      }
    };
    var settings = {
      reportLevel: 'debug'
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.be.ok();
  });
  it('true if ignoredMessages is empty', function() {
    var item = {
      level: 'critical',
      body: {
        trace: {exception: {message: 'bork bork'}},
        message: {body: 'fuzz'}
      }
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: []
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.be.ok();
  });
  it('true if no exception message', function() {
    var item = {
      level: 'critical',
      body: {
        trace: {exception: {}},
        message: 'fuzz'
      }
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['bork bork', 'fuzz']
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.be.ok();
  });
  it('true if no ignoredMessages match', function() {
    var item = {
      level: 'critical',
      body: {
        trace: {exception: {message: 'bork bork'}},
        message: {body: 'fuzz'}
      }
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['fake', 'stuff']
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.be.ok();
  });
  it('false if any ignoredMessages match', function() {
    var item = {
      level: 'critical',
      body: {
        trace: {exception: {message: 'bork bork'}},
        message: {body: 'fuzz'}
      }
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['bork bork', 'stuff']
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it('false if ignoredMessages regex match', function() {
    var item = {
      level: 'critical',
      body: {
        message: {body: 'This is an ignored message'}
      }
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['^This is an .{7} message$']
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it('false if ignoredMessages literal match', function() {
    var item = {
      level: 'critical',
      body: {
        message: {body: '{"data":{"messages":[{"message":"Unauthorized"}]}}'}
      }
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['{"data":{"messages":\\[']
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it('false if ignoredMessages more literal regex matches', function() {
    var item = {
      level: 'critical',
      body: {
        message: {body: 'Match these characters: (*+?)'}
      }
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['\\(\\*\\+\\?\\)']
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it('true if both trace and body message but ignoredMessages only match body', function() {
    var item = {
      level: 'critical',
      body: {
        trace: {exception: {message: 'bork bork'}},
        message: {body: 'fuzz'}
      }
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['fuzz', 'stuff']
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.be.ok();
  });
  it('false if ignoredMessages match something in body exception message', function() {
    var item = {
      level: 'critical',
      body: {
        trace: {frames: []},
        message: {body: 'fuzz'}
      }
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['stuff', 'fuzz']
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
});
