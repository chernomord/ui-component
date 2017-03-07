import {TagModel, AttributeModel, TextNodeModel, Controller} from './DOMModel';
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

    it('should properly render itself', () => {
        let html = rootTagModel.render();
        expect(html.innerText).toEqual('child text');
    });

    it('should bind event handler', () => {
        let div = new TagModel('div');
        let attr = new AttributeModel('on:click', 'doIncrement()');
        let tag = new TagModel('button', [attr]);
        div.appendChild(tag);
        class Bindings extends Controller {
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
    });

    it('should inject DOM Event and other requested parameters into handler', () => {
        let div = new TagModel('div');
        let attr = new AttributeModel('on:click', 'handler($this, $event, intValue, stringValue)');
        let tag = new TagModel('button', [attr]);
        div.appendChild(tag);
        class Bindings extends Controller {
            intValue = 0;
            stringValue = 'Hello!';
            result: {elm: HTMLElement, event: Event, int: Number, string: string};

            constructor() {
                super();
            }

            handler(elm: HTMLElement, event: Event, int: Number, string: string) {
                this.result = {elm, event, int, string};
                console.log(this.result);
            }
        }
        let bindings = new Bindings();
        let element = div.render(bindings);
        let button = element.querySelector('button');
        button.click();
        expect(bindings.result.elm instanceof HTMLElement).toBeTruthy();
        expect(bindings.result.event instanceof Event).toBeTruthy();
        expect(bindings.result.int === 0).toBeTruthy();
        expect(bindings.result.string === 'Hello!').toBeTruthy();
    });

    it('should parse data bindings', () => {
        let HTML = `<div class="{{component}}"><h1>{{header}}</h1><a href="{{link.href}}">{{link.name}}</a></div>`;
        class Bindings extends Controller {
            component = 'myComponent';
            header = 'Hey there';
            link = {
                href: 'http://myurl.com',
                name: 'my dynamic link'
            };

            constructor() {
                super();
            }
        }
        let parser = new HTMLParser();
        let model = parser.parseHTML(HTML);
        let controller = new Bindings();
        let element = model.render(controller);
        expect(element.classList.contains('myComponent')).toBeTruthy();
        expect(element.childNodes[0].textContent).toBe(controller.header);
        expect(element.childNodes[1].textContent).toBe(controller.link.name);
        expect(element.childNodes[1].getAttribute('href')).toBe(controller.link.href);
    });

    xit('can render repeated fragment', () => {
        let HTML = `<div class="container">
<div class="element" n-for="element of elements">
<a></a>
</div>
</div>`
    })
});
