const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Mocha = require('mocha');
const assert = require('chai').assert;
const mocha = new Mocha();
const messages = require('../js/messages');
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div class="foo">my content</div></body></html>');

global.window = dom.window;
global.document = dom.window.document;

const image = new JSDOM('<image src="stuff"></image>');
const span = new JSDOM('<span class="nameClass" id="nameId" style="color:blue"> Joe: </span>');

describe('messages.js', () => {
  it('imageBuilder should return an image object', () => {

    assert(messages.imageBuilder('stuff'), image);
  })

  it('imageBuilder should have an src of stuff', () => {
    assert(messages.imageBuilder('stuff').src, image.src);
  })

  it('appendName should be a span', () => {
    assert(messages.appendName('Joe', 'blue'), span);
  })
})
