const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Mocha = require('mocha');
const assert = require('chai').assert;
const mocha = new Mocha();
const messages = require('../js/messages');
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div class="foo">my content</div></body></html>');

global.window = dom.window;
global.document = dom.window.document;
console.log(messages);

describe('messages.js', () => {
  it('imageBuilder should return an image object', () => {
    const image = new JSDOM('<image src="stuff"></image>')
    assert(messages.imageBuilder('stuff'), image);
  })
})
