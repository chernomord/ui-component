import {HTMLParser} from './component/parser';

let parser = new HTMLParser();
let template = `<section>
<div>
<h1>UI testing starts here</h1>
<h2>Tags testing block</h2>
<form>
    <div>
    <label for="text-input">Some label</label>
    <input type="text" id="text-input">
</div>
</form>
</div>
</section>`;

let template2 = `<div><section class="some sort of classes">
<div>
<h1>UI testing starts here</h1>
<h2>Tags testing block</h2>
<form>
    <div>
    <label for="text-input">Some label</label>
    <input type="text" id="text-input">
</div>
</form>
</div>
</section>
<section><p></p></section></div>`;

console.time('parse');
let model = parser.parseHTML(template);
console.timeEnd('parse');
console.time('render');
let element = model.render();
console.timeEnd('render');

console.time('parse');
let model1 = parser.parseHTML(template2);
console.timeEnd('parse');
console.time('render');
let element1 = model1.render();
console.timeEnd('render');

document.body.appendChild(element);

document.addEventListener('load', () => {
    // let app = document.createElement('div');
    document.body.appendChild(model.render());
    // console.log('lol');
});


let methods : { [name:string] : Function } = {};

methods = {
    someMethod: () => {},
    another: () => {}
};
