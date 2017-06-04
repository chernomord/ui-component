import Diary from './diary';

describe('DiaryComponent', () => {
   it('should be Object', () => {
       const diary = new Diary();
       expect(typeof diary).toEqual('object');
   });
});