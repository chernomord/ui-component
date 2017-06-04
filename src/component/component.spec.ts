import Component from './component';

describe('Component class Class', () => {
    it('Can be instantiated', () => {
        const post = new Component('', {}, {});
        expect(post instanceof Component).toBe(true);
    });

    it('Can return some data', () => {
        const post = new Component('', {lol: 34}, {});
        const data = post.getData('lol');
        expect(data).toEqual(34);
    });

    it('Can render template into DOM tree', () => {
        const root = document.createElement('div');
        const post = new Component('<h1>{{message}}</h1>', {message: 'Zodzog!'});
        const element = post.render();
        root.appendChild(element);
        // console.log(element);
        expect(element instanceof HTMLElement).toBe(true);
    });

    // it('Can bind event handler to element', () => {
    //     let root = document.createElement('div');
    //     let event: MouseEvent = null;
    //     let post = new Component(`<h1 e-on:click="myMethod('lol', message)">{{message}}{{should not be resolved}}</h1>`, {message: 'Zodzog!'}, {
    //         myMethod: function (e) {
    //             event = e;
    //             return e
    //         }
    //     });
    //     let element = post.render();
    //     console.log(element);
    //     root.appendChild(element);
    //     console.log(<Node>element.click());
    //     expect(event instanceof MouseEvent).toBe(true);
    // });
    xit('Can repeat html with data', () => {
        const root = document.createElement('div');
        const dataList = ['one', 'two', 'three'];
        const template = `<div><p e-repeat="unit in dataList">{{unit}}</p></div>`;
        const list = new Component(template, {dataList});
        const element = list.render();
        root.appendChild(element);
        expect(root.querySelector('p').innerHTML === 'one').toBe(true);
    });
    // it('Can instantiate another component with repeat', () => {
    //     let root = document.createElement('div');
    //     let posts = [{message: 'one'}, {message: 'two'}, {message: 'three'}];
    //     let template = `<div><post-message e-repeat="post in posts" e-put:message="message.message"></post-message></div>`;
    //     let blog = new Component(template, {message: 'Zodzog!'}, {
    //         myMethod: function (e) {
    //             event = e;
    //             return e
    //         }
    //     });
    //     root.appendChild(blog);
    //     expect(event instanceof MouseEvent).toBe(true);
    // });
});
