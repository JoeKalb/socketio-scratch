const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Mocha = require('mocha');
const assert = require('chai').assert;
const mocha = new Mocha();
const messages = require('../js/messages');
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div class="foo">my content</div></body></html>');

// global window and variable objects
global.window = dom.window;
global.document = dom.window.document;
global.messageColor = "black";
global.localEmotes = {CoolCat: {
  code: "CoolCat",
  description: null,
  emoticon_set: 0,
  id: 58127
}};
global.sessionStorage = {};
global.sessionStorage.getItem = () => { return false; }
global.emoteURL = 'http://static-cdn.jtvnw.net/emoticons/v1/{image_id}/1.0';
global.iconValue = "";


// testing elements
const image = new JSDOM('<image src="stuff"></image>');
const nameSpan = new JSDOM('<span class="nameClass" id="nameId"> Joe: </span>');
const messageSpan = new JSDOM('<span>hallo </span>');
const emoteImage = new JSDOM('<image src="http://static-cdn.jtvnw.net/emoticons/v1/58127/1.0"></image>');
const replaceEmotesTextSpan = new JSDOM('<span>potato </span>');
const replaceEmotesImageSpan = new JSDOM('<span><image src="http://static-cdn.jtvnw.net/emoticons/v1/58127/1.0"></image></span>');

describe('messages.js', () => {
  it('imageBuilder should return an image object', () => {
    assert(messages.imageBuilder('stuff'), image);
  })

  it('imageBuilder should have an src of stuff', () => {
    assert(messages.imageBuilder('stuff').src, image.src);
  })

  it('appendName should be a span', () => {
    assert(messages.appendName('Joe', 'blue'), nameSpan);
  })

  it('appendName should be a span have innerHTML of \' Joe: \'', () => {
    assert(messages.appendName('Joe', 'blue').innerHTML, nameSpan.innerHTML);
  })

  it('appendName should be a span have color of \'blue\'', () => {
    assert(messages.appendName('Joe', 'blue').style.color, 'blue');
  })

  it('appendText should create a span', () => {
    assert(messages.appendText('hallo'), messageSpan);
  })

  it('appendText should have text of \'hallo \'', () => {
    assert(messages.appendText('hallo').innerHTML, messageSpan.innerHTML);
  })

  it('appendText should have style.color of \'black\'', () => {
    assert(messages.appendText('hallo').style.color, 'black');
  })

  it('findEmoteId should have return \'potato \'', () => {
    assert(messages.findEmoteId('potato'), 'potato ');
  })

  it('findEmoteId should have return Image object', () => {
    assert(messages.findEmoteId('CoolCat'), emoteImage);
  })

  it('findEmoteId should have return Image.src \'http://static-cdn.jtvnw.net/emoticons/v1/58127/1.0\'', () => {
    assert(messages.findEmoteId('CoolCat').src, emoteImage.src);
  })

  it('replaceEmotes should return a span', () => {
    assert(messages.replaceEmotes('potato'), replaceEmotesTextSpan);
  })

  it('replaceEmotes should have text \'potato \'', () => {
    assert(messages.replaceEmotes('potato').innerHTML, replaceEmotesTextSpan.innerHTML);
  })

  it('replaceEmotes should return a span with image inside', () => {
    assert(messages.replaceEmotes('CoolCat'), replaceEmotesImageSpan);
  })
})
