const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Mocha = require('mocha');
const assert = require('chai').assert;
const mocha = new Mocha();

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div class="foo">my content</div></body></html>');

global.window = dom.window;
global.document = dom.window.document;

function getContentByClassName(className) {
  const elements = document.getElementsByClassName(className);
  if (elements.length === 0) {
    return '';
  }

  return elements[0].innerHTML;
}

const topLevel = this;
mocha.suite.emit('pre-require', topLevel, 'solution', mocha);

describe('#getContentByClassName', () => {
  it('should return an empty string if given a non existent class', () => {

    assert(getContentByClassName('bar') === '');
  });

  it('should return the content of a class', () => {

    assert(getContentByClassName('foo') === 'my content');
  });
});
