import {HTMLParser} from './parser';

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
        let {tag, restOfHTML} = parser.extractTag(`<div class="some">Text<span>and more</span></div>`);
        expect(tag).toEqual('<div class="some">');
        expect(restOfHTML).toEqual('Text<span>and more</span></div>');
    });

    it('cat extract closing Tag', () => {
        let parser = new HTMLParser();
        let {tag, restOfHTML} = parser.extractTag(`</section><div class="some">Text<span>and more</span></div>`);
        expect(tag).toEqual('</section>');
        expect(restOfHTML).toEqual('<div class="some">Text<span>and more</span></div>');
    });

    it('cat extract text content', () => {
        let parser = new HTMLParser();
        let {textValue, restOfHTML} = parser.extractTextContent(`Some text here</section><div class="some">Text<span>and more</span></div>`);
        expect(textValue).toEqual('Some text here');
        expect(restOfHTML).toEqual('</section><div class="some">Text<span>and more</span></div>');
    });

    it('cat parse tag', () => {
        let parser = new HTMLParser();
        let tagWithAttrs = `<div style="display: block; border: 0;" class="one two">`;
        let emptyTag = `<input>`;
        let {tagName, attrs} = parser.parseTag(tagWithAttrs);
        expect(tagName).toEqual('div');
        expect(attrs.length).toEqual(2);
        expect(attrs[0]).toEqual('style="display: block; border: 0;"');
        expect(attrs[1]).toEqual('class="one two"');
    });

    // todo: add more test for parser

    it('can parse TextNode fragment', () => {
        let parser = new HTMLParser();
        let textNode = parser.parseTextNodeFragment('Text node<div>Not to be<span>parsed</span></div>');
        expect(textNode.value).toEqual('Text node');
        expect(textNode.render() instanceof Node).toBe(true);
    });

    // it('can return proper tag type', () => {
    //     let tag = new TagModel(`<div></div>`);
    //     // console.log(JSON.stringify(tag, censorCircular, 2));
    //     expect(tag.tagType('<p>text')).toBe(1);
    //     expect(tag.tagType('</p>text')).toBe(2);
    //     expect(tag.tagType('</div>')).toBe(2);
    //     expect(tag.tagType('text<p>')).toBe(3);
    //     expect(tag.tagType('text</p>')).toBe(3);
    // });
    //
    // it('can parse HTML string into proper model', () => {
    //     let tag = new TagModel(`<p class=" zod-zog some " style="{border: red;} " /><input type="number"><span data=""><b>sdfsdf</b>Some text</span><b>about</b> tags</p>`);
    //     // console.log(JSON.stringify(tag, censorCircular, 2));
    //     expect(tag.attrs[1].name).toBe('style');
    //     expect(tag.children[0].attrs[0].name).toBe('type');
    //     expect(tag.children.length).toBe(4);
    //     expect(tag.children[1].children[0].name).toBe('b');
    //     expect(tag.children[1].children[0].children[0].value).toBe('sdfsdf');
    // });
    //
    // it('can render parsed HTML', () => {
    //     let template = `<p class=" zod-zog some " style="{border: red;} " /><input type="number"><span data=""><b>sdfsdf</b>Some text</span><b>about</b> tags</p>`;
    //     let tag = new TagModel(template);
    //     let element = tag.render();
    //     let elnew = document.createElement('div');
    //     elnew.innerHTML = template;
    //     expect(elnew.children[0].children[1].children[0].textContent).toBe(element.children[1].children[0].textContent);
    // });
});