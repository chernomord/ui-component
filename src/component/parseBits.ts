import {Controller} from './controller';

const parseBits = {
    curlyBindings: function (inputValue: string, controller: Controller) {
        let resultValue: string;
        if (inputValue.indexOf('{{') > -1) {
            resultValue = inputValue.replace(/{{(.*?)}}/g, (m, binding) => this.jsonPath(binding, controller));
        }
        return resultValue || inputValue;
    },
    jsonPath: (path: string, object: Controller) => {
        let pathArr = path.split('.');
        let cursor = object;
        pathArr.map((val, i, arr) => {
            cursor = cursor[val];
        });
        return cursor;
    }
};

export {parseBits}
