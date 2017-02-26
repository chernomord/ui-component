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

/**
 * Describes attribute
 */
class AttributeModel {

    constructor(public name: string,
                public value: string = '') {
    }

    /**
     * Returns attribute Node
     * @returns {Attr}
     */
    render(): Attr {
        let attr = document.createAttribute(this.name);
        attr.value = this.value;
        return attr;
    }
}

/**
 * Abstract Node Model class
 */
class NodeModel {
    parent: TagModel;
    children: NodeModel[];

    constructor() {
    }

    /**
     * Renders node into DOM Node object
     */
    render() : Node {
        return
    }

    /**
     * Gets parent of the Node
     * @returns {TagModel}
     */
    getParent() {
        return this.parent;
    }
}

/**
 * Describes Text Node model
 */
class TextNodeModel extends NodeModel {

    constructor(public value: string = '', public parent: TagModel = null) {
        super();
    }

    render(): Node {
        return document.createTextNode(this.value);
    }
}

/**
 * Describes Element Node model
 */
class TagModel extends NodeModel {

    constructor(public name: string,
                public attrs: AttributeModel[] = [],
                public parent: TagModel = null) {
        super();
        this.children = [];
    }

    /**
     * Appends child Node and sets it's parent field to current Element model instance
     * @param element
     */
    appendChild(element: NodeModel): void {
        this.children.push(element);
        element.parent = this;
    }

    /**
     * Render self and all it's children if there is any
     * @returns {HTMLElement}
     */
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