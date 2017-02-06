import {TagModel} from './createDocumentFragment';

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

describe('tagModel', () => {

    xit('can parse self closing tag', () => {
        let tag = new TagModel('<p class="zod-zog">');
        console.log(JSON.stringify(tag, null, 2));
        expect(tag.attrs.length).toBe(1);
        expect(tag instanceof TagModel).toBe(true);
    });

    xit('can parse html into model', () => {
        let tag = new TagModel(`<p class="zod-zog"><span>Some text</span>about tags</p>`);
        console.log(JSON.stringify(tag, null, 2));
        expect(tag.attrs.length).toBe(1);
        expect(tag instanceof TagModel).toBe(true);
    });

    it('can return proper tag type', () => {
        let tag = new TagModel(`<div></div>`);
        console.log(JSON.stringify(tag, censorCircular, 2));
        expect(tag.tagType('<p>text')).toBe(1);
        expect(tag.tagType('</p>text')).toBe(2);
        expect(tag.tagType('</div>')).toBe(2);
        expect(tag.tagType('text<p>')).toBe(3);
        expect(tag.tagType('text</p>')).toBe(3);
    });

    it('can parse html', () => {
        let tag = new TagModel(`<p class=" zod-zog some " style="{border: red;} " /><input type="number"><span data=""><b>sdfsdf</b>Some text</span><b>about</b> tags</p>`);
        // console.log(JSON.stringify(tag, censorCircular, 2));
        expect(tag.attrs[1].name).toBe('style');
        expect(tag.children[0].attrs[0].name).toBe('type');
        expect(tag.children.length).toBe(4);
        expect(tag.children[1].children[0].name).toBe('b');
        expect(tag.children[1].children[0].children[0].value).toBe('sdfsdf');
    });

    it('can render parsed HTML', () => {
        let template = `<p class=" zod-zog some " style="{border: red;} " /><input type="number"><span data=""><b>sdfsdf</b>Some text</span><b>about</b> tags</p>`;
        let tag = new TagModel(template);
        let element = tag.render();
        let elnew = document.createElement('div');
        elnew.innerHTML = template;
        expect(elnew.children[0].children[1].children[0].textContent).toBe(element.children[1].children[0].textContent);
    });
});