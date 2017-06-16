/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var url = require('../src/browser/url');

describe('parse', function() {
  it('should return an object full of nulls for a blank url', function() {
    var u = '';
    var parsed = url.parse(u);
    expect(parsed).to.be.ok();
  });
  it('should get the protocol', function() {
    var http = 'http://something.com';
    var parsedHttp = url.parse(http);
    expect(parsedHttp.protocol).to.eql('http:');
    var file = 'file://something.com';
    var parsedFile = url.parse(file);
    expect(parsedFile.protocol).to.eql('file:');
  });
  it('should get everything if it is there', function() {
    var u = 'https://me:you@fake.example.co.uk:85/a/path/object//with/crap?a=b&c=d#hashy!';
    var p = url.parse(u);
    expect(p.protocol).to.eql('https:');
    expect(p.auth).to.eql('me:you');
    expect(p.host).to.eql('fake.example.co.uk:85');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.eql(85);
    expect(p.path).to.eql('/a/path/object//with/crap?a=b&c=d');
    expect(p.pathname).to.eql('/a/path/object//with/crap');
    expect(p.search).to.eql('?a=b&c=d');
    expect(p.query).to.eql('a=b&c=d');
    expect(p.hash).to.eql('#hashy!');
  });
  it('should get stuff even if some things are missing', function() {
    var u = 'https://fake.example.co.uk/a/path/object//with/crap#hashy!';
    var p = url.parse(u);
    expect(p.protocol).to.eql('https:');
    expect(p.auth).to.not.be.ok();
    expect(p.host).to.eql('fake.example.co.uk');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.not.be.ok();
    expect(p.path).to.eql('/a/path/object//with/crap');
    expect(p.pathname).to.eql('/a/path/object//with/crap');
    expect(p.search).to.not.be.ok();
    expect(p.query).to.not.be.ok();
    expect(p.hash).to.eql('#hashy!');
  });
  it('should get stuff even the path is missing', function() {
    var u = 'https://fake.example.co.uk#hashy!';
    var p = url.parse(u);
    expect(p.protocol).to.eql('https:');
    expect(p.auth).to.not.be.ok();
    expect(p.host).to.eql('fake.example.co.uk');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.not.be.ok();
    expect(p.path).to.not.be.ok();
    expect(p.pathname).to.not.be.ok();
    expect(p.search).to.not.be.ok();
    expect(p.query).to.not.be.ok();
    expect(p.hash).to.eql('#hashy!');
  });
  it('should get stuff with a query and no path', function() {
    var u = 'https://fake.example.co.uk?a=b';
    var p = url.parse(u);
    expect(p.protocol).to.eql('https:');
    expect(p.auth).to.not.be.ok();
    expect(p.host).to.eql('fake.example.co.uk');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.not.be.ok();
    expect(p.path).to.eql('?a=b');
    expect(p.pathname).to.not.be.ok();
    expect(p.search).to.eql('?a=b');
    expect(p.query).to.eql('a=b');
    expect(p.hash).to.not.be.ok();
  });
  it('should get stuff with a query and blank path', function() {
    var u = 'https://fake.example.co.uk/?a=b';
    var p = url.parse(u);
    expect(p.protocol).to.eql('https:');
    expect(p.auth).to.not.be.ok();
    expect(p.host).to.eql('fake.example.co.uk');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.not.be.ok();
    expect(p.path).to.eql('/?a=b');
    expect(p.pathname).to.eql('/');
    expect(p.search).to.eql('?a=b');
    expect(p.query).to.eql('a=b');
    expect(p.hash).to.not.be.ok();
  });
  it('should get stuff with a missing protocol', function() {
    var u = '//fake.example.co.uk/v1/#hashash';
    var p = url.parse(u);
    expect(p.protocol).to.not.be.ok();
    expect(p.auth).to.not.be.ok();
    expect(p.host).to.eql('fake.example.co.uk');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.not.be.ok();
    expect(p.path).to.eql('/v1/');
    expect(p.pathname).to.eql('/v1/');
    expect(p.search).to.not.be.ok();
    expect(p.query).to.not.be.ok();
    expect(p.hash).to.eql('#hashash');
  });
  it('should handle missing protocol without slashes', function() {
    var u = 'api.rollbar.com/api/1';
    var p = url.parse(u);
    expect(p.protocol).to.not.be.ok();
    expect(p.host).to.eql('api.rollbar.com');
    expect(p.hostname).to.eql('api.rollbar.com');
    expect(p.path).to.eql('/api/1');
    expect(p.pathname).to.eql('/api/1');
    expect(p.auth).to.not.be.ok();
    expect(p.port).to.not.be.ok();
    expect(p.search).to.not.be.ok();
    expect(p.query).to.not.be.ok();
    expect(p.hash).to.not.be.ok();
  });
});
