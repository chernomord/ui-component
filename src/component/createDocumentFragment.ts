enum selfClosingTags  {
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
}

class AttributeModel {
    name: string;
    value: string;

    constructor(attr: string) {
        this.parseAttribute(attr);
    }

    parseAttribute(attr: string) {
        let [name, value] = attr.split('=');
        this.name = name;
        value = (value) ? value.trim() : undefined;
        this.value = (value) ? value.replace(/['"]+/g, '') : '';
    }

    render(): Attr {
        let attr = document.createAttribute(this.name);
        attr.value = this.value;
        return attr;
    }
}

class NodeModel {
    parent: TagModel;
    children: NodeModel[] = [];

    constructor() {
    }

    parseHTML(HTMLString: string): void {
    }

    render(): Node {
        return document.createElement('div');
    }
}

class TextNodeModel extends NodeModel {
    // value: string;
    // parent: TagModel;

    constructor(public value: string,
                public parent: TagModel) {
        super();
        // this.parent = parent;
        // this.parseHTML(HTMLString);
    }

    parseHTML(HTMLString: string): void {
        let textEndId = HTMLString.indexOf('<');
        let textValue = HTMLString.substring(0, textEndId);
        let restOfHTML = HTMLString.substring(textEndId);
        this.value = textValue;
        this.parent.appendChild(this);
        new TagModel(restOfHTML, this.parent);
    }

    render(): Node {
        return document.createTextNode(this.value);
    }
}


class TagModel extends NodeModel {
    name: string;
    attrs: AttributeModel[];
    // children = [];

    constructor(tagString: string, parent = null) {
        super();
        // this.children = [];
        this.parent = parent;
        this.parseHTML(tagString);
    }

    parseTag(tagString: string): void {
        let [match, tag, attributesStr] = tagString.match(/<(\w+)[\s+]?([^>]+)?>/);
        this.name = tag;
        this.attrs = [];
        if (attributesStr) {
            let attrStrings = [];
            attributesStr.replace(/(\w+[$="]\D[^"]*["])/g, (match, g1) => {
                attrStrings.push(g1);
                return match;
            });
            for (let attr of attrStrings) {
                this.attrs.push(new AttributeModel(attr));
            }
        }
    }

    parseHTML(HTMLString: string): void {
        let curSegment = HTMLString.substring(0);
        switch (this.tagType(curSegment)) {
            case 1 : // opening tag
                // extract and parse tag string and append self to parent
                let closingIndex = curSegment.indexOf(">", 1);
                let tag = curSegment.substring(0, closingIndex + 1);
                this.parseTag(tag);
                if (this.parent) {
                    this.parent.appendChild(this);
                }
                // create child from the rest of the HTML string
                let restOfHTML = curSegment.substr(closingIndex + 1, curSegment.length);
                let parent: TagModel;
                (selfClosingTags.hasOwnProperty(this.name)) ? parent = this.parent : parent = this;
                new TagModel(restOfHTML, parent);
                break;
            case 2 : // closing tag
                let closingTagSliced = curSegment.replace(/^(<\/\w+[^])/, '');
                new TagModel(closingTagSliced, this.parent.parent);
                break;
            case 3 : // text content
                new TextNodeModel(curSegment, this.parent);
                break;
            default:
                break;
        }
    }

    tagType(HTMLString: string): number {
        enum Types {
            Open = 1,
            Closing,
            Text
        }
        let type = '';
        if (/^[<]\w/.test(HTMLString)) {
            type = 'Open'
        } else if (/^[<]\/\w/.test(HTMLString)) {
            type = 'Closing'
        } else if (HTMLString.length > 0) {
            type = 'Text'
        }
        return Types[type]
    }

    appendChild(element: NodeModel): void {
        this.children.push(element);
    }

    render(): HTMLElement {
        let element = document.createElement(this.name);
        for (let attr of this.attrs) {
            element.setAttributeNode(attr.render())
        }
        for (let child of this.children) {
            element.appendChild(child.render());
        }
        return element;
    }
}

export {TagModel, TextNodeModel, AttributeModel, NodeModel}