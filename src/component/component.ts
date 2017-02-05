import {EventBindingsCollection, Handler} from './event-bindings-collection';

export default class Component {
    constructor(private template: string, private data?: Object, private methods?: Object) {
    }

    getData(prop): String | Number {
        return this.data[prop];
    }

    render(): Node {

        let container = document.createElement('div');

        // resolve one way data binding
        let XMLstringWData = this.template.replace(/{{(.*?)}}/g, (fragment, contents) => {
            let result = '';
            let content = contents.trim();
            if (this.data.hasOwnProperty(content)) {
                result = this.data[content];
            } else {
                result = fragment;
            }
            return result;
        });

        let handlersMap: Array<Handler>;

        let event = '';
        let method = '';

        XMLstringWData = XMLstringWData.replace(/e-on:(...+)="(...+)\((...+)\)"/g, (fragment, evName, callbackName, args) => {
            let argsList = args.replace(/\s+/g, '').split(',');
            let result = '';
            result = 'id=abc';
            return result;
        });
        container.innerHTML = XMLstringWData;
        // container.querySelector('[id=666]');
        let el = container.querySelector('#abc');
        container.firstChild.addEventListener(event, (e: Event) => {
            return this.methods[method].call(this, e);
        }, true);
        return container.firstChild;
    }

}