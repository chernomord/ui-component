interface PostData {
    header;
    body;
    date;
}

export default class Post {
    header: String;
    body: String;
    date: Date;
    deleteEntryCallback: Function;

    constructor(header: String, body: String, date = new Date(), deleteEntryCallback: Function) {
        this.header = header;
        this.body = body;
        this.date = date;
        this.deleteEntryCallback = deleteEntryCallback;
    }

    getData(): PostData {
        return {
            header: this.header,
            body: this.body,
            date: this.date
        }
    }
}
