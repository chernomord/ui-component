interface Handler {
    eventName: string;
    callbackName: string;
    arguments: string;
}

class EventBindingsCollection {
    private handlers: any;

    constructor() {
        this.handlers = {};
    }

    private generateShortID() {
        return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
    }

    addH(handler: Handler) : string {
        let id = this.generateShortID();
        this.handlers[id] = {...handler};
        return this.generateShortID()
    }

    getH(elID: string) {
        return this.handlers[elID];
    }
}

export {EventBindingsCollection, Handler};