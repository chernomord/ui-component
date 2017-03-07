import {HTMLParser} from './component/parser';
import {Controller} from './component/DOMModel';

let parser = new HTMLParser();
let template = `<section>
<div>
<h1>{{title}}</h1>
<h2>{{subtitle}}</h2>
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
    title = "Test playground";
    subtitle = "Just to see results on the screen aside from tests";
    hello() {
        alert('Hello!');
    }
}


let model = parser.parseHTML(template);
let controller = new TestCtrl();
let element = model.render(controller);

document.body.appendChild(element);
