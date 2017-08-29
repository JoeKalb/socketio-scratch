const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Mocha = require('mocha');
const assert = require('chai').assert;
const mocha = new Mocha();
require('../js/messages');
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div class="foo">my content</div></body></html>');

global.window = dom.window;
global.document = dom.window.document;

describe('messages.js', () => {
  it('check that value returns itselt with a space', () => {
    assert(findEmoteId('keepo'), 'keepo ');
  })
})
