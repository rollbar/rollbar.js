/* globals describe */
/* globals it */

import { expect } from 'chai';
import Locals from '../src/server/locals.js';
import logger from '../src/logger.js';

describe('server.locals constructor', function () {
  it('should use defaults when passing true boolean', function () {
    const locals = new Locals(true, logger);
    expect(locals.options.enabled).to.be.true;
    expect(locals.options.uncaughtOnly).to.be.true;
    expect(locals.options.depth).to.equal(1);
    expect(locals.options.maxProperties).to.equal(30);
    expect(locals.options.maxArray).to.equal(5);
  });

  it('should use defaults when passing false boolean', function () {
    const locals = new Locals(false, logger);
    expect(locals.options.enabled).to.be.true;
    expect(locals.options.uncaughtOnly).to.be.true;
    expect(locals.options.depth).to.equal(1);
    expect(locals.options.maxProperties).to.equal(30);
    expect(locals.options.maxArray).to.equal(5);
  });

  it('should use defaults when passing empty object', function () {
    const locals = new Locals({}, logger);
    expect(locals.options.enabled).to.be.true;
    expect(locals.options.uncaughtOnly).to.be.true;
    expect(locals.options.depth).to.equal(1);
    expect(locals.options.maxProperties).to.equal(30);
    expect(locals.options.maxArray).to.equal(5);
  });

  it('should use updated depth with remaining defaults', function () {
    const locals = new Locals({ depth: 0 }, logger);
    expect(locals.options.enabled).to.be.true;
    expect(locals.options.uncaughtOnly).to.be.true;
    expect(locals.options.depth).to.equal(0);
    expect(locals.options.maxProperties).to.equal(30);
    expect(locals.options.maxArray).to.equal(5);
  });

  it('should use updated enabled with remaining defaults', function () {
    const locals = new Locals({ enabled: false }, logger);
    expect(locals.options.enabled).to.be.false;
    expect(locals.options.uncaughtOnly).to.be.true;
    expect(locals.options.depth).to.equal(1);
    expect(locals.options.maxProperties).to.equal(30);
    expect(locals.options.maxArray).to.equal(5);
  });

  it('should use updated uncaughtOnly with remaining defaults', function () {
    const locals = new Locals({ uncaughtOnly: false }, logger);
    expect(locals.options.enabled).to.be.true;
    expect(locals.options.uncaughtOnly).to.be.false;
    expect(locals.options.depth).to.equal(1);
    expect(locals.options.maxProperties).to.equal(30);
    expect(locals.options.maxArray).to.equal(5);
  });

  it('should use all updated options', function () {
    const locals = new Locals(
      {
        enabled: false,
        uncaughtOnly: false,
        depth: 2,
        maxProperties: 15,
        maxArray: 10,
      },
      logger,
    );
    expect(locals.options.enabled).to.be.false;
    expect(locals.options.uncaughtOnly).to.be.false;
    expect(locals.options.depth).to.equal(2);
    expect(locals.options.maxProperties).to.equal(15);
    expect(locals.options.maxArray).to.equal(10);
  });
});
