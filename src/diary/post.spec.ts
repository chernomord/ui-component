import Post from './post';

describe('Post Class', () => {
   it('can be instantiated', () => {
       let post = new Post('header text', 'body text', new Date(), () => {});
       expect(post instanceof Post).toBe(true);
   });

    it('can return data', () => {
        let post = new Post('header text', 'body text', new Date(), () => {});
        expect(post.getData).toBeDefined();
    })
});