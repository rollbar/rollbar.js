/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var p = require('../src/browser/predicates');

describe('checkIgnore', function () {
  it('should return false if is ajax and ignoring ajax errors is on', function () {
    var item = {
      level: 'critical',
      body: { message: { extra: { isAjax: true } } },
    };
    var settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.not.be.ok();
  });
  it('should return true if is ajax and ignoring ajax errors is off', function () {
    var item = {
      level: 'critical',
      body: { message: { extra: { isAjax: true } } },
    };
    var settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: false } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
  it('should return true if is not ajax and ignoring ajax errors is on', function () {
    var item = {
      level: 'critical',
      body: { message: { extra: { isAjax: false } } },
    };
    var settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
  it('should return true if no ajax extra key and ignoring ajax errors is on', function () {
    var item = {
      level: 'critical',
      body: { message: 'a message' },
    };
    var settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
});
