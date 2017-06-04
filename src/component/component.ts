export default class Component {
    constructor(private template: string,
                private data?: {},
                private methods?: {}) {
    }

    public getData(prop): string | number {
        return this.data[prop];
    }

    public render(): Node {

        const container = document.createElement('div');

        // resolve one way data binding
        let XMLstringWData = this.template.replace(/{{(.*?)}}/gm, (fragment, contents) => {
            let result = '';
            const content = contents.trim();
            if (this.data.hasOwnProperty(content)) {
                result = this.data[content];
            } else {
                result = fragment;
            }
            return result;
        });

        const event = '';
        const method = '';

        XMLstringWData = XMLstringWData
            .replace(/e-on:(...+)="(...+)\((...+)\)"/gm, (fragment, evName, callbackName, args) => {
            const argsList = args.replace(/\s+/g, '').split(',');
            let result = '';
            result = 'id=abc';
            return result;
        });
        container.innerHTML = XMLstringWData;
        // container.querySelector('[id=666]');
        // const el = container.querySelector('#abc');
        container.firstChild.addEventListener(event, (e: Event) => {
            return this.methods[method].call(this, e);
        }, true);
        return container.firstChild;
    }

}