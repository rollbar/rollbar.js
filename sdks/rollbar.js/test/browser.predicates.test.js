/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var p = require('../src/browser/predicates');

describe('checkIgnore', function() {
  it('should return false if level is too low', function() {
    var item = {level: 'debug'};
    var settings = {reportLevel: 'critical'};
    expect(p.checkIgnore(item, settings)).to.not.be.ok();
  });
  it('should return true if level is the same', function() {
    var item = {level: 'debug'};
    var settings = {reportLevel: 'debug'};
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
  it('should return true if level higher', function() {
    var item = {level: 'critical'};
    var settings = {reportLevel: 'debug'};
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
  it('should return true if level unknown', function() {
    var item = {level: 'fake'};
    var settings = {reportLevel: 'debug'};
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
  it('should return false if is ajax and ignoring ajax errors is on', function() {
    var item = {
      level: 'critical',
      body: {message: {extra: {isAjax: true}}}
    };
    var settings = {
      reportLevel: 'debug',
      plugins: {jquery: {ignoreAjaxErrors: true}}
    };
    expect(p.checkIgnore(item, settings)).to.not.be.ok();
  });
  it('should return true if is ajax and ignoring ajax errors is off', function() {
    var item = {
      level: 'critical',
      body: {message: {extra: {isAjax: true}}}
    };
    var settings = {
      reportLevel: 'debug',
      plugins: {jquery: {ignoreAjaxErrors: false}}
    };
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
  it('should return true if is not ajax and ignoring ajax errors is on', function() {
    var item = {
      level: 'critical',
      body: {message: {extra: {isAjax: false}}}
    };
    var settings = {
      reportLevel: 'debug',
      plugins: {jquery: {ignoreAjaxErrors: true}}
    };
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
  it('should return true if no ajax extra key and ignoring ajax errors is on', function() {
    var item = {
      level: 'critical',
      body: {message: 'a message'}
    };
    var settings = {
      reportLevel: 'debug',
      plugins: {jquery: {ignoreAjaxErrors: true}}
    };
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
});

describe('userCheckIgnore', function() {
  it('should return true if no user function', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug'};
    expect(p.userCheckIgnore(item, settings)).to.be.ok();
  });
  it('should return true if checkIgnore is not a function', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug', checkIgnore: true};
    expect(p.userCheckIgnore(item, settings)).to.be.ok();
  });
  it('should return true if checkIgnore returns false', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug', checkIgnore: function() {
      return false;
    }};
    expect(p.userCheckIgnore(item, settings)).to.be.ok();
  });
  it('should return false if checkIgnore returns true', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug', checkIgnore: function() {
      return true;
    }};
    expect(p.userCheckIgnore(item, settings)).to.not.be.ok();
  });
  it('should return true if checkIgnore throws', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug', checkIgnore: function() {
      throw new Error('bork bork');
    }};
    expect(p.userCheckIgnore(item, settings)).to.be.ok();
    expect(settings.checkIgnore).to.not.be.ok();
  });
  it('should get the right arguments', function() {
    var item = {level: 'debug', body: 'stuff', _originalArgs: [1,2,3]};
    var settings = {reportLevel: 'debug', checkIgnore: function(isUncaught, args, payload) {
      expect(isUncaught).to.not.be.ok();
      expect(args).to.eql([1,2,3]);
      expect(payload).to.eql(item);
    }};
    expect(p.userCheckIgnore(item, settings)).to.be.ok();
  });
});

describe('urlIsWhitelisted', function() {
  it('should return true with no whitelist', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: [
        {filename: 'http://api.fake.com/v1/something'},
        {filename: 'http://api.example.com/v1/something'},
        {filename: 'http://api.fake.com/v2/something'}
      ]}}
    };
    var settings = {
      reportLevel: 'debug'
    };
    expect(p.urlIsWhitelisted(item, settings)).to.be.ok();
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
    expect(p.urlIsWhitelisted(item, settings)).to.be.ok();
  });
  it('should return true if at least one regex matches at least one filename in the trace', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: [
        {filename: 'http://api.fake.com/v1/something'},
        {filename: 'http://api.example.com/v1/something'},
        {filename: 'http://api.fake.com/v2/something'}
      ]}}
    };
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['example.com']
    };
    expect(p.urlIsWhitelisted(item, settings)).to.be.ok();
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
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['nope.com']
    };
    expect(p.urlIsWhitelisted(item, settings)).to.be.ok();
  });
  it('should return true if there is no frames key', function() {
    var item = {
      level: 'critical',
      body: {trace: {notframes: []}}
    };
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['nope.com']
    };
    expect(p.urlIsWhitelisted(item, settings)).to.be.ok();
  });
  it('should return false if there are no frames', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: []}}
    };
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['nope.com']
    };
    expect(p.urlIsWhitelisted(item, settings)).to.not.be.ok();
  });
  it('should return false if nothing in the whitelist matches', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: [
        {filename: 'http://api.fake.com/v1/something'},
        {filename: 'http://api.example.com/v1/something'},
        {filename: 'http://api.fake.com/v2/something'}
      ]}}
    };
    var settings = {
      reportLevel: 'debug',
      hostWhiteList: ['baz\.com', 'foo\.com']
    };
    expect(p.urlIsWhitelisted(item, settings)).to.not.be.ok();
  });
});

describe('urlIsNotBlacklisted', function() {
  it('should return true with no blacklist', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: [
        {filename: 'http://api.fake.com/v1/something'},
        {filename: 'http://api.example.com/v1/something'},
        {filename: 'http://api.fake.com/v2/something'}
      ]}}
    };
    var settings = {
      reportLevel: 'debug'
    };
    expect(p.urlIsNotBlacklisted(item, settings)).to.be.ok();
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
    expect(p.urlIsNotBlacklisted(item, settings)).to.be.ok();
  });
  it('should return false if any regex matches at least one filename in the trace', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: [
        {filename: 'http://api.fake.com/v1/something'},
        {filename: 'http://api.example.com/v1/something'},
        {filename: 'http://api.fake.com/v2/something'}
      ]}}
    };
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['example.com', 'other.com']
    };
    expect(p.urlIsNotBlacklisted(item, settings)).to.not.be.ok();
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
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['example.com', 'other.com']
    };
    expect(p.urlIsNotBlacklisted(item, settings)).to.be.ok();
  });
  it('should return true if there is no frames key', function() {
    var item = {
      level: 'critical',
      body: {trace: {notframes: []}}
    };
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['nope.com']
    };
    expect(p.urlIsNotBlacklisted(item, settings)).to.be.ok();
  });
  it('should return true if there are no frames', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: []}}
    };
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['nope.com']
    };
    expect(p.urlIsNotBlacklisted(item, settings)).to.be.ok();
  });
  it('should return true if nothing in the blacklist matches', function() {
    var item = {
      level: 'critical',
      body: {trace: {frames: [
        {filename: 'http://api.fake.com/v1/something'},
        {filename: 'http://api.example.com/v1/something'},
        {filename: 'http://api.fake.com/v2/something'}
      ]}}
    };
    var settings = {
      reportLevel: 'debug',
      hostBlackList: ['baz\.com', 'foo\.com']
    };
    expect(p.urlIsNotBlacklisted(item, settings)).to.be.ok();
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
    expect(p.messageIsIgnored(item, settings)).to.be.ok();
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
    expect(p.messageIsIgnored(item, settings)).to.be.ok();
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
    expect(p.messageIsIgnored(item, settings)).to.be.ok();
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
    expect(p.messageIsIgnored(item, settings)).to.be.ok();
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
    expect(p.messageIsIgnored(item, settings)).to.not.be.ok();
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
    expect(p.messageIsIgnored(item, settings)).to.be.ok();
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
    expect(p.messageIsIgnored(item, settings)).to.not.be.ok();
  });
});

