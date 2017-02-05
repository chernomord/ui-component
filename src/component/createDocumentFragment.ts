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
        let [name, value] = attr.split('=');
        this.name = name;
        value = (value) ? value.trim() : undefined;
        this.value = (value) ? value.replace(/['"]+/g, '') : '';
    }
}

class NodeModel {
    parent: TagModel;

    constructor() {
    }

    parseHTML(HTMLString: string) {
    }

    render() {
    }
}

class TextNodeModel extends NodeModel {
    value: string;

    constructor(HTMLString: string, parent: TagModel) {
        super();
        this.parent = parent;
        this.parseHTML(HTMLString);
        //parent.appendChild(this);
    }

    parseHTML(HTMLString: string) {
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
    children: NodeModel[];

    constructor(tagString: string, parent = null) {
        super();
        this.children = [];
        this.parent = parent;
        this.parseHTML(tagString);
    }

    parseTag(tagString: string) {
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

    parseHTML(HTMLString: string) {
        let curSegment = HTMLString.substring(0);
        if (this.tagType(curSegment) === 1) {
            // open tag
            let closingIndex = curSegment.indexOf(">", 1);
            let tag = curSegment.substring(0, closingIndex + 1);
            this.parseTag(tag);
            if (this.parent) {
                this.parent.appendChild(this);
            }
            // add children
            let restOfHTML = curSegment.substr(closingIndex + 1, curSegment.length);
            // decide parent by current html element type
            let parent: TagModel;
            if (selfClosingTags.hasOwnProperty(this.name)) {
                parent = this.parent;
            } else {
                parent = this;
            }
            new TagModel(restOfHTML, parent);
        } else if (this.tagType(curSegment) === 2) {
            // closing tag
            let closingTagSliced = curSegment.replace(/^(<\/\w+[^])/, '');
            new TagModel(closingTagSliced, this.parent.parent);
        } else if (this.tagType(curSegment) === 3) {
            new TextNodeModel(curSegment, this.parent);
        }
    }

    tagType(HTMLString: string) {
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

    appendChild(element: NodeModel) {
        this.children.push(element);
    }
}

export {TagModel}