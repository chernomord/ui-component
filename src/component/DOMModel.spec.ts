import {TagModel, AttributeModel, TextNodeModel, Controller} from './DOMModel';

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

describe('Attribute model', () => {
    const attributeWithValue = new AttributeModel('style', 'border:0; color: black');
    const attributeNoValue = new AttributeModel('disabled');

    it('should instantiate itself and return data properly', () => {
        expect(attributeWithValue.name).toEqual('style');
        expect(attributeWithValue.value).toEqual('border:0; color: black');
        expect(attributeNoValue.name).toEqual('disabled');
        expect(attributeNoValue.value).toEqual('');
    });

    it('should render into Attr Node', () => {
        let attrNode = attributeWithValue.render();
        expect(attrNode instanceof Attr).toBe(true);
        expect(attrNode.name).toEqual('style');
        expect(attrNode.value).toEqual('border:0; color: black');
    });
});

describe('Text Node model', () => {
    const textNodeModel = new TextNodeModel('Text content');

    it('should instantiate itself and return data properly', () => {
        expect(textNodeModel.value).toEqual('Text content');
    });

    it('should render into Text Node', () => {
        let textNode = textNodeModel.render();
        expect(textNode instanceof Node).toBe(true);
        expect(textNode.nodeValue).toEqual('Text content');
    });
});

describe('Tag Node model', () => {
    let attrs = [new AttributeModel('class', 'first second'), new AttributeModel('enabled')];
    const rootTagModel = new TagModel('div', attrs);
    const childTagModel = new TextNodeModel('child text');
    rootTagModel.appendChild(childTagModel);

    it('should instantiate itself and return data properly', () => {
        expect(rootTagModel.name).toEqual('div');
        expect(rootTagModel.attrs.length).toEqual(2);
        expect(rootTagModel.attrs[0].value).toEqual('first second');
    });

    it('should be able to append a child', () => {
        // rootTagModel.appendChild(childTagModel);
        expect(rootTagModel.children.length).toBe(1);
        expect(childTagModel.getParent().name).toBe('div');
    });

    it('should properly render itseld', () => {
        let html = rootTagModel.render();
        expect(html.innerText).toEqual('child text');
    });

    it('should bind event handler', () => {
        let div = new TagModel('div');
        let attr = new AttributeModel('on:click', 'doIncrement()');
        let tag = new TagModel('button', [attr]);
        div.appendChild(tag);
        class Bindings extends Controller{
            increment = 0;
            constructor() {
                super();
            }

            doIncrement() {
                this.increment += 1;
            }
        }
        let bindings = new Bindings();
        let element = div.render(bindings);
        let button = element.querySelector('button');
        button.click();
        expect(bindings.increment).toEqual(1);
        button.click();
        expect(bindings.increment).toEqual(2);
    })
});
