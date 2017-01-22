import Diary from './diary';

describe('DiaryComponent', () => {
   it('should be Object', () => {
       let diary = new Diary();
       expect(typeof diary).toEqual('object');
   })
});