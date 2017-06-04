import {TagModel, AttributeModel, TextNodeModel, Controller} from './DOMModel';
import {HTMLParser} from './parser';

const cache = [];
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
        const attrNode = attributeWithValue.render(new Controller());
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
        const textNode = textNodeModel.render(new Controller());
        expect(textNode instanceof Node).toBe(true);
        expect(textNode.nodeValue).toEqual('Text content');
    });
});

describe('Tag Node model', () => {
    const attrs = [new AttributeModel('class', 'first second'), new AttributeModel('enabled')];
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

    it('should properly render itself', () => {
        const html = rootTagModel.render();
        expect(html.innerText).toEqual('child text');
    });

    it('should bind event handler', () => {
        const div = new TagModel('div');
        const attr = new AttributeModel('on:click', 'doIncrement()');
        const tag = new TagModel('button', [attr]);
        div.appendChild(tag);
        class Bindings extends Controller {
            public increment = 0;

            constructor() {
                super();
            }

            public doIncrement() {
                this.increment += 1;
            }
        }
        const bindings = new Bindings();
        const element = div.render(bindings);
        const button = element.querySelector('button');
        button.click();
        expect(bindings.increment).toEqual(1);
        button.click();
        expect(bindings.increment).toEqual(2);
    });

    it('should inject DOM Event and other requested parameters into handler', () => {
        const div = new TagModel('div');
        const attr = new AttributeModel('on:click', 'handler($this, $event, intValue, stringValue)');
        const tag = new TagModel('button', [attr]);
        div.appendChild(tag);
        class Bindings extends Controller {
            public intValue = 0;
            public stringValue = 'Hello!';
            public result: {elm: HTMLElement, event: Event, int: number, myString: string};

            constructor() {
                super();
            }

            public handler(elm: HTMLElement, event: Event, int: number, myString: string) {
                this.result = {elm, event, int, myString};
            }
        }
        const bindings = new Bindings();
        const element = div.render(bindings);
        const button = element.querySelector('button');
        button.click();
        expect(bindings.result.elm instanceof HTMLElement).toBeTruthy();
        expect(bindings.result.event instanceof Event).toBeTruthy();
        expect(bindings.result.int === 0).toBeTruthy();
        expect(bindings.result.myString === 'Hello!').toBeTruthy();
    });

    it('should parse data bindings', () => {
        const HTML = `<div class="{{component}}"><h1>{{header}} bro!</h1><a href="{{link.href}}">{{link.name}}</a></div>`;
        class Bindings extends Controller {
            public component = 'myComponent';
            public header = 'Hey there';
            public link = {
                href: 'http://myurl.com',
                name: 'my dynamic link',
            };
        }
        const parser = new HTMLParser();
        const model = parser.parseHTML(HTML);
        const controller = new Bindings();
        const element = model.render(controller);
        expect(element.getAttribute('class')).toBe('myComponent');
        expect(element.children[0].textContent).toBe(controller.header + ' bro!');
        expect(element.children[1].textContent).toBe(controller.link.name);
        expect(element.children[1].getAttribute('href')).toBe(controller.link.href);
    });

    xit('can render repeated fragment', () => {
        const HTML = `<div class="container">
<div class="element" n-for="element of elements">
<a></a>
</div>
</div>`;
    });

});
