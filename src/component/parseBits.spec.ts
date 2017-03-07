import {parseBits} from './parseBits';
import {Controller} from './controller';


describe('ParseBits parser helper', () => {
    it('should traverse path', () => {
        let path = 'b.c.d';
        class Source extends Controller {
            b = {
                c: {
                    d: 'target'
                }
            };
        }
        let source = new Source();
        let target = parseBits.jsonPath(path, source);
        expect(target).toBe('target');
    });

    it('should parse curly bindings', () => {
        class MyCtrl extends Controller {
            b = {
                c: {
                    d: 'target'
                }
            };
            header = 'My header';

        }
        let input = '{{b.c.d}} and header: {{header}}';
        let bindings = new MyCtrl();
        let result = parseBits.curlyBindings(input, bindings);
        expect(result).toBe('target and header: My header');
    })
});