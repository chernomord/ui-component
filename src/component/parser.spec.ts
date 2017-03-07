import {HTMLParser} from './parser';
import {Controller} from './controller';

let cache = [];
function censorCircular(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
            return;
        }
        cache.push(value);
    }
    return value;
}

describe('DOMParser', () => {

    it('cat extract Tag', () => {
        let parser = new HTMLParser();
        let {result, restOfHTML} = parser.extractTag(`<div class="some">Text<span>and more</span></div>`);
        expect(result).toEqual('<div class="some">');
        expect(restOfHTML).toEqual('Text<span>and more</span></div>');
    });

    it('cat extract closing Tag', () => {
        let parser = new HTMLParser();
        let {result, restOfHTML} = parser.extractTag(`</section><div class="some">Text<span>and more</span></div>`);
        expect(result).toEqual('</section>');
        expect(restOfHTML).toEqual('<div class="some">Text<span>and more</span></div>');
    });

    it('cat extract text content', () => {
        let parser = new HTMLParser();
        let {result, restOfHTML} = parser.extractTextContent(`Some text here</section><div class="some">Text<span>and more</span></div>`);
        expect(result).toEqual('Some text here');
        expect(restOfHTML).toEqual('</section><div class="some">Text<span>and more</span></div>');
    });

    it('can parse tag', () => {
        let parser = new HTMLParser();
        let tagWithAttrs = `<div style="display: block; border: 0;" class="one two" on:click="something()">`;
        let emptyTag = `<input>`;
        let tagModel = parser.parseTag(tagWithAttrs);
        let inputModel = parser.parseTag(emptyTag);
        expect(tagModel.name).toEqual('div');
        expect(tagModel.attrs.length).toEqual(3);
        expect(tagModel.attrs[0].name).toEqual('style');
        expect(tagModel.attrs[1].value).toEqual('one two');
        expect(tagModel.attrs[2].name).toEqual('on:click');
        expect(inputModel.name).toEqual('input');
    });

    it('can parse text', () => {
        let text = 'Text to parse';
        let parser = new HTMLParser();
        let textNode = parser.parseText(text);
        expect(textNode.value).toEqual('Text to parse');
    });

    it('can parse HTML string into proper model', () => {
        let HTML = `<p class=" zod-zog some " style="border: red;" /><input type="number"><span data=""><b>sdfsdf</b>Some text</span><b>about</b> tags</p>`;
        let parser = new HTMLParser();
        let model = parser.parseHTML(HTML);
        expect(model.attrs[1].name).toBe('style');
        expect(model.children[0].attrs[0].name).toBe('type');
        expect(model.children.length).toBe(4);
        expect(model.children[1].children[0].name).toBe('b');
        expect(model.children[1].children[0].children[0].value).toBe('sdfsdf');
    });

    it('can return proper tag type', () => {
        let tag = new HTMLParser();
        expect(tag.tagType('<p>text')).toBe(1);
        expect(tag.tagType('</p>text')).toBe(2);
        expect(tag.tagType('</div>')).toBe(2);
        expect(tag.tagType('text<p>')).toBe(3);
        expect(tag.tagType('text</p>')).toBe(3);
    });

    it('should not result in error if multiple root elements passed in a string template', () => {
       let template = `<div><h1>Header</h1></div><h1></h1><section><div></div></section>`;
       let parser = new HTMLParser();
       let model = parser.parseHTML(template);
       let element = model.render(new Controller);
       expect(element instanceof HTMLElement).toBeTruthy();
       expect(element.childNodes.length).toBe(1);
    });

});