import {HTMLParser} from './component/parser';
import {Controller} from './component/DOMModel';

let parser = new HTMLParser();
let template = `<section>
<div>
<h1>UI testing starts here 1</h1>
<h2>Tags testing block</h2>
<form>
    <div>
    <label for="text-input">Some label</label>
    <input type="text" id="text-input">
</div>

</form>
<div><button type="button" on:click="hello()">Say Hello!</button></div>
</div>
</section>`;


class TestCtrl extends Controller {
    constructor(){
        super();
    }
    hello() {
        alert('Hello!');
    }
}

console.time('parse');
let model = parser.parseHTML(template);
console.timeEnd('parse');
console.time('render');
let controller = new TestCtrl();
let element = model.render(controller);
console.timeEnd('render');

document.body.appendChild(element);
//
// document.addEventListener('load', () => {
//     // let app = document.createElement('div');
//     document.body.appendChild(element);
//     // console.log('lol');
// });
//
