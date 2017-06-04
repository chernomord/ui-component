interface IPostData {
    header;
    body;
    date;
}

export default class Post {

    constructor(public header: string,
                public body: string,
                public date = new Date(),
                public deleteEntryCallback: () => void) {
    }

    public getData(): IPostData {
        return {
            body: this.body,
            date: this.date,
            header: this.header,
        };
    }
}
