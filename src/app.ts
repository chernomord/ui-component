import {Controller} from './component/DOMModel';
import {HTMLParser} from './component/parser';

const parser = new HTMLParser();
const template = `<section>
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
    public title = 'Test playground';
    public subtitle = 'Just to see results on the screen aside from tests';
    public hello() {
        alert('Hello!');
    }
}

const model = parser.parseHTML(template);
const controller = new TestCtrl();
const element = model.render(controller);

document.body.appendChild(element);
