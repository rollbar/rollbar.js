// @ts-nocheck
import { expect } from 'chai';

import * as p from '../src/browser/predicates.js';

describe('checkIgnore', function () {
  it('should return false if is ajax and ignoring ajax errors is on', function () {
    const item = {
      level: 'critical',
      body: { message: { extra: { isAjax: true } } },
    };
    const settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.not.be.ok;
  });
  it('should return true if is ajax and ignoring ajax errors is off', function () {
    const item = {
      level: 'critical',
      body: { message: { extra: { isAjax: true } } },
    };
    const settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: false } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok;
  });
  it('should return true if is not ajax and ignoring ajax errors is on', function () {
    const item = {
      level: 'critical',
      body: { message: { extra: { isAjax: false } } },
    };
    const settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok;
  });
  it('should return true if no ajax extra key and ignoring ajax errors is on', function () {
    const item = {
      level: 'critical',
      body: { message: 'a message' },
    };
    const settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok;
  });
});
