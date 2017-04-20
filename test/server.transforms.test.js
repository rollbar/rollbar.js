"use strict";

var assert = require('assert');
var util = require('util');
var vows = require('vows');
var t = require('../src/server/transforms');
var rollbar = require('../src/server/rollbar');
var _ = require('../src/utility');

function CustomError(message, nested) {
  rollbar.Error.call(this, message, nested);
}
util.inherits(CustomError, rollbar.Error);

vows.describe('transforms')
  .addBatch({
    'baseData': {
      'options': {
        'defaults': {
          topic: function() {
            return rollbar.defaultOptions;
          },
          'item': {
            'empty': {
              topic: function(options) {
                var item = {};
                t.baseData(item, options, this.callback);
              },
              'should have a timestamp': function(err, item) {
                assert.ifError(err);
                assert.notEqual(item.data, undefined);
                assert.notEqual(item.data.timestamp, undefined);
              },
              'should have an error level': function(err, item) {
                assert.ifError(err);
                assert.notEqual(item.data, undefined);
                assert.equal(item.data.level, 'error');
              },
              'should have some defaults': function(err, item) {
                assert.ifError(err);
                var data = item.data;
                assert.equal(data.environment, 'development');
                assert.equal(data.framework, 'node-js');
                assert.equal(data.language, 'javascript');
                assert.ok(data.server);
                assert.ok(data.server.host);
                assert.ok(data.server.pid);
              }
            },
            'with values': {
              topic: function(options) {
                var item = {
                  level: 'critical',
                  framework: 'star-wars',
                  uuid: '12345',
                  environment: 'production',
                  custom: {
                    one: 'a1',
                    stuff: 'b2',
                    language: 'english'
                  }
                };
                t.baseData(item, options, this.callback);
              },
              'should have a critical level': function(err, item) {
                assert.ifError(err);
                assert.equal(item.data.level, 'critical');
              },
              'should have the defaults overriden by the item': function(err, item) {
                assert.ifError(err);
                assert.equal(item.data.environment, 'production');
                assert.equal(item.data.framework, 'star-wars');
                assert.equal(item.data.language, 'javascript');
                assert.equal(item.data.uuid, '12345');
              },
              'should have data from custom': function(err, item) {
                assert.equal(item.data.one, 'a1');
                assert.equal(item.data.stuff, 'b2');
                assert.notEqual(item.data.language, 'english');
              }
            }
          }
        },
        'with values': {
          topic: function() {
            return _.extend(true, {}, rollbar.defaultOptions, {
              environment: 'opt-prod',
              framework: 'opt-node',
              host: 'opt-host',
              branch: 'opt-master'
            });
          },
          'item': {
            'empty': {
              topic: function(options) {
                var item = {};
                t.baseData(item, options, this.callback);
              },
              'should have a timestamp': function(err, item) {
                assert.ifError(err);
                assert.notEqual(item.data, undefined);
                assert.notEqual(item.data.timestamp, undefined);
              },
              'should have an error level': function(err, item) {
                assert.ifError(err);
                assert.notEqual(item.data, undefined);
                assert.equal(item.data.level, 'error');
              },
              'should have data from options and defaults': function(err, item) {
                assert.ifError(err);
                var data = item.data;
                assert.equal(data.environment, 'opt-prod');
                assert.equal(data.framework, 'opt-node');
                assert.equal(data.language, 'javascript');
                assert.ok(data.server);
                assert.equal(data.server.host, 'opt-host');
                assert.equal(data.server.branch, 'opt-master');
                assert.ok(data.server.pid);
              }
            },
            'with values': {
              topic: function(options) {
                var item = {
                  level: 'critical',
                  framework: 'star-wars',
                  uuid: '12345',
                  environment: 'production',
                  custom: {
                    one: 'a1',
                    stuff: 'b2',
                    language: 'english'
                  }
                };
                t.baseData(item, options, this.callback);
              },
              'should have a critical level': function(err, item) {
                assert.ifError(err);
                assert.equal(item.data.level, 'critical');
              },
              'should have the defaults overriden by the item': function(err, item) {
                assert.ifError(err);
                assert.equal(item.data.environment, 'production');
                assert.equal(item.data.framework, 'star-wars');
                assert.equal(item.data.language, 'javascript');
                assert.equal(item.data.uuid, '12345');
              },
              'should have data from custom': function(err, item) {
                assert.equal(item.data.one, 'a1');
                assert.equal(item.data.stuff, 'b2');
                assert.notEqual(item.data.language, 'english');
              }
            }
          }
        }
      }
    }
  })
  .addBatch({
    'addMessageData': {
      'options': {
        'anything': {
          topic: function() {
            return {random: 'stuff'};
          },
          'item': {
            'no message': {
              topic: function(options) {
                var item = {err: 'stuff', not: 'a message'};
                t.addMessageData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should add an empty body': function(err, item) {
                assert.ok(item.data.body);
              }
            },
            'with a message': {
              topic: function(options) {
                var item = {message: 'this is awesome'};
                t.addMessageData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should add a body with the message': function(err, item) {
                assert.equal(item.data.body.message.body, 'this is awesome');
              }
            }
          }
        }
      }
    }
  })
  .addBatch({
    'buildErrorData': {
      'options': {
        'anything': {
          topic: function() {
            return {some: 'stuff'};
          },
          'item': {
            'no error': {
              topic: function(options) {
                var item = {
                  data: {body: {yo: 'hey'}},
                  message: 'hey'
                };
                t.buildErrorData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should not change the item': function(err, item) {
                assert.equal(item.data.body.yo, 'hey');
              }
            },
            'with a simple error': {
              topic: function (options) {
                var item = {
                  data: {body: {}},
                  err: new Error('wookie')
                };
                t.buildErrorData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should add some data to the trace_chain': function(err, item) {
                assert.ok(item.data.body.trace_chain);
              }
            },
            'with a normal error': {
              topic: function (options) {
                var test = function() {
                  var x = thisVariableIsNotDefined;
                };
                var err;
                try {
                  test();
                } catch (e) {
                  err = e;
                }
                var item = {
                  data: {body: {}},
                  err: err
                };
                t.buildErrorData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should add some data to the trace_chain': function(err, item) {
                assert.ok(item.data.body.trace_chain);
              }
            },
            'with a nested error': {
              topic: function (options) {
                var test = function() {
                  var x = thisVariableIsNotDefined;
                };
                var err;
                try {
                  test();
                } catch (e) {
                  err = new CustomError('nested-message', e);
                }
                var item = {
                  data: {body: {}},
                  err: err
                };
                t.buildErrorData(item, options, this.callback);
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should have the right data in the trace_chain': function(err, item) {
                var trace_chain = item.data.body.trace_chain;
                assert.lengthOf(trace_chain, 2);
                assert.equal(trace_chain[0].exception.class, 'CustomError');
                assert.equal(trace_chain[0].exception.message, 'nested-message');
                assert.equal(trace_chain[1].exception.class, 'ReferenceError');
              }
            }
          }
        }
      }
    }
  })
  .addBatch({
    'addRequestData': {
      'options': {
        'without custom addRequestData method': {
          'without scrub fields': {
            topic: function() {
              return {nothing: 'here'};
            },
            'item': {
              'without a request': {
                topic: function(options) {
                  var item = {
                    data: {body: {message: 'hey'}}
                  };
                  t.addRequestData(item, options, this.callback);
                },
                'should not error': function(err, item) {
                  assert.ifError(err);
                },
                'should not change the item': function(err, item) {
                  assert.equal(item.request, undefined);
                  assert.equal(item.data.request, undefined);
                }
              },
              'with a request': {
                topic: function(options) {
                  var item = {
                    request: {
                      headers: {
                        host: 'example.com',
                        'x-auth-token': '12345'
                      },
                      protocol: 'https',
                      url: '/some/endpoint',
                      ip: '192.192.192.1',
                      method: 'GET',
                      body: {
                        token: 'abc123',
                        something: 'else'
                      },
                      user: {
                        id: 42,
                        email: 'fake@example.com'
                      }
                    },
                    stuff: 'hey',
                    data: {other: 'thing'}
                  };
                  t.addRequestData(item, options, this.callback);
                },
                'should not error': function(err, item) {
                  assert.ifError(err);
                },
                'should have a request object inside data': function(err, item) {
                  assert.ok(item.data.request);
                },
                'should set a person based on request user': function(err, item) {
                  assert.equal(item.data.person.id, 42);
                  assert.equal(item.data.person.email, 'fake@example.com');
                },
                'should set some fields based on request data': function(err, item) {
                  var r = item.data.request;
                  assert.equal(r.url, 'https://example.com/some/endpoint');
                  assert.equal(r.user_ip, '192.192.192.1');
                  assert.ok(r.GET);
                },
              }
            }
          },
          'with scrub fields': {
            topic: function() {
              return {
                scrubHeaders: [
                  'x-auth-token'
                ],
                scrubFields: [
                  'passwd',
                  'access_token',
                  'request.cookie'
                ]
              };
            },
            'item': {
              'with a request': {
                topic: function(options) {
                  var item = {
                    request: {
                      headers: {
                        host: 'example.com',
                        'x-auth-token': '12345'
                      },
                      protocol: 'https',
                      url: '/some/endpoint',
                      ip: '192.192.192.192',
                      method: 'GET',
                      body: {
                        token: 'abc123',
                        something: 'else'
                      },
                      user: {
                        id: 42,
                        email: 'fake@example.com'
                      }
                    },
                    stuff: 'hey',
                    data: {other: 'thing'}
                  };
                  t.addRequestData(item, options, this.callback);
                },
                'should not error': function(err, item) {
                  assert.ifError(err);
                },
                'should have a request object inside data': function(err, item) {
                  assert.ok(item.data.request);
                },
              }
            }
          }
        },
        'with custom addRequestData': {
          'with scrub fields': {
            topic: function() {
              var customFn = function(i, r) {
                assert.equal(i.stuff, undefined);
                assert.equal(i.other, 'thing');
                i.myRequest = {body: r.body.token};
              };
              return {
                addRequestData: customFn,
                scrubFields: [
                  'passwd',
                  'access_token',
                  'token',
                  'request.cookie'
                ]
              };
            },
            'item': {
              'with a request': {
                topic: function(options) {
                  var item = {
                    request: {
                      headers: {
                        host: 'example.com',
                        'x-auth-token': '12345'
                      },
                      protocol: 'https',
                      url: '/some/endpoint',
                      ip: '192.192.192.192',
                      method: 'GET',
                      body: {
                        token: 'abc123',
                        something: 'else'
                      },
                      user: {
                        id: 42,
                        email: 'fake@example.com'
                      }
                    },
                    stuff: 'hey',
                    data: {other: 'thing'}
                  };
                  t.addRequestData(item, options, this.callback);
                },
                'should not error': function(err, item) {
                  assert.ifError(err);
                },
                'should do what the function does': function(err, item) {
                  assert.equal(item.data.request, undefined);
                  assert.equal(item.data.myRequest.body, 'abc123');
                }
              }
            }
          }
        }
      }
    }
  })
  .addBatch({
    'scrubPayload': {
      'options': {
        'without scrub fields': {
          topic: function() {
            return {nothing: 'here'};
          },
          'item': {
            topic: function(options) {
              var item = {
                data: {
                  body: {
                    message: 'hey',
                    password: '123',
                    secret: {stuff: 'here'}
                  }
                }
              };
              t.scrubPayload(item, options, this.callback);
            },
            'should not error': function(err, item) {
              assert.ifError(err);
            },
            'should not scrub okay keys': function(err, item) {
              assert.equal(item.data.body.message, 'hey');
            },
            'should scrub key/value based on defaults': function(err, item) {
              assert.matches(item.data.body.password, /\**/);
              assert.matches(item.data.body.secret, /\**/);
            }
          }
        },
        'with scrub fields': {
          topic: function() {
            return {
              scrubHeaders: [
                'x-auth-token'
              ],
              scrubFields: [
                'passwd',
                'access_token',
                'request.cookie',
                'sauce'
              ]
            };
          },
          'item': {
            'with a request': {
              topic: function(options) {
                var item = {
                  request: {
                    headers: {
                      host: 'example.com',
                      'x-auth-token': '12345'
                    },
                    protocol: 'https',
                    url: '/some/endpoint',
                    ip: '192.192.192.192',
                    method: 'GET',
                    body: {
                      token: 'abc123',
                      something: 'else'
                    },
                    user: {
                      id: 42,
                      email: 'fake@example.com'
                    }
                  },
                  stuff: 'hey',
                  data: {
                    other: 'thing',
                    sauce: 'secrets',
                    someParams: 'foo=okay&passwd=iamhere'
                  }
                };
                t.addRequestData(item, options, function(e, i) {
                  if (e) {
                    this.callback(e);
                    return;
                  }
                  t.scrubPayload(i, options, this.callback)
                }.bind(this));
              },
              'should not error': function(err, item) {
                assert.ifError(err);
              },
              'should have a request object inside data': function(err, item) {
                assert.ok(item.data.request);
              },
              'should scrub based on the options': function(err, item) {
                var r = item.data.request;
                assert.equal(r.GET.token, 'abc123');
                assert.match(r.headers['x-auth-token'], /\**/);
                assert.equal(r.headers['host'], 'example.com');
                assert.match(item.data.sauce, /\**/);
                assert.equal(item.data.other, 'thing');
                assert.match(item.data.someParams, /foo=okay&passwd=\**/);
              }
            }
          }
        }
      }
    }
  })
  .export(module, {error: false});
