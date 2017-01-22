import Diary from './diary/diary';
import Post from './diary/post';

document.addEventListener('load', () => {
    let app = document.createElement('div');
    document.body.appendChild(app);
    console.log('lol');
});


let diary = new Diary();
let book: Diary;
