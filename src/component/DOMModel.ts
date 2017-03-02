/**
 * Abstract Controller
 */
class Controller {
    constructor() {
    }
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
    attrs: AttributeModel[];
    name: string;
    value: string;

    constructor() {
    }

    /**
     * Renders node into DOM Node object
     */
    render(controller: Controller = null): Node {
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
    controller: Controller;

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
     * @param controller {Controller}
     * @returns {HTMLElement}
     */
    render(controller: Controller = null): HTMLElement {
        let element = document.createElement(this.name);
        // add event handlers
        for (let attr of this.attrs) {
            // handle attribute if it is event handler declaration
            if (attr.name.indexOf('on:') === 0) {
                let eventName = 'on' + attr.name.substring(3);
                let [fm, methodName, parameters] = attr.value.match(/(\w+)\((.*?)\)/);
                let paramsArray = parameters.replace(/\s/g, '').split(',');
                element[eventName] = function (event) {

                    // convert parameters names to point to controller's properties
                    for (let i in paramsArray) {
                        if (paramsArray[i] === '$event') {
                            paramsArray[i] = event;
                            console.log(paramsArray[i]);
                        } else {
                            paramsArray[i] = controller[paramsArray[i]];
                        }
                    }
                    // call controller's method by extracted name with extracted parameters
                    controller[methodName].apply(controller, paramsArray);
                }
            } else {
                element.setAttributeNode(attr.render());
            }
        }
        for (let child of this.children) {
            element.appendChild(child.render(controller));
        }
        return element;
    }
}

export {TagModel, TextNodeModel, AttributeModel, NodeModel, Controller}