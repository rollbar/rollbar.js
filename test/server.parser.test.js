"use strict";

var assert = require('assert');
var vows = require('vows');
var p = require('../src/server/parser');

vows.describe('parser')
  .addBatch({
    'parseStack': {
      'a valid stack trace': {
        topic: function() {
          var item = { diagnostic: {} }
          var stack = 'ReferenceError: foo is not defined\n' +
                      '  at MethodClass.method.<anonymous> (app/server.js:2:4)\n' +
                      '  at /app/node_modules/client.js:321:23\n' +
                      '  at (/app/node_modules/client.js:321:23)\n' +
                      '  at MethodClass.method.(anonymous) (app/server.js:62:14)\n' +
                      '  at MethodClass.method (app/server.ts:52:4)\n' +
                      '  at MethodClass.method (app/server.js:62:14)\n';
          p.parseStack(stack, {}, item, this.callback);
        },
        'should parse valid js frame': function(err, frames) {
          var frame = frames[0];
          assert.ifError(err);
          assert.equal(frame.method, 'MethodClass.method');
          assert.equal(frame.filename, 'app/server.js');
          assert.equal(frame.lineno, 62);
          assert.equal(frame.colno, 14-1);
        },
        'should parse valid ts frame': function(err, frames) {
          var frame = frames[1];
          assert.ifError(err);
          assert.equal(frame.method, 'MethodClass.method');
          assert.equal(frame.filename, 'app/server.ts');
          assert.equal(frame.lineno, 52);
          assert.equal(frame.colno, 4-1);
        },
        'should parse method with parens': function(err, frames) {
          var frame = frames[2];
          assert.ifError(err);
          assert.equal(frame.method, 'MethodClass.method.(anonymous)');
          assert.equal(frame.filename, 'app/server.js');
          assert.equal(frame.lineno, 62);
          assert.equal(frame.colno, 14-1);
        },
        'should parse without method and with leading slash': function(err, frames) {
          var frame = frames[3];
          assert.ifError(err);
          assert.equal(frame.method, '<unknown>');
          assert.equal(frame.filename, '/app/node_modules/client.js');
          assert.equal(frame.lineno, 321);
          assert.equal(frame.colno, 23-1);
        },
        'should parse without method or parens': function(err, frames) {
          var frame = frames[4];
          assert.ifError(err);
          assert.equal(frame.method, '<unknown>');
          assert.equal(frame.filename, '/app/node_modules/client.js');
          assert.equal(frame.lineno, 321);
          assert.equal(frame.colno, 23-1);
        },
        'should parse method with angle brackets': function(err, frames) {
          var frame = frames[5];
          assert.ifError(err);
          assert.equal(frame.method, 'MethodClass.method.<anonymous>');
          assert.equal(frame.filename, 'app/server.js');
          assert.equal(frame.lineno, 2);
          assert.equal(frame.colno, 4-1);
        },
      },
    }
  }).export(module, {error: false});;
