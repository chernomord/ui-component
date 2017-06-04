import {Controller} from './controller';
import {parseBits} from './parseBits';


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
    public render(controller: Controller): Attr {
        const attr = document.createAttribute(this.name);
        attr.value = parseBits.curlyBindings(this.value, controller);
        return attr;
    }
}

/**
 * Abstract Node Model class
 */
abstract class NodeModel {
    public attrs: AttributeModel[];
    public children: NodeModel[];
    public parent: TagModel;
    public name: string;
    public value: string;

    // constructor() {}

    /**
     * Renders node into DOM Node object
     */
    abstract render(controller: Controller): Node;

    /**
     * Gets parent of the Node
     * @returns {TagModel}
     */
    public getParent(): TagModel {
        return this.parent;
    }
}

/**
 * Describes Text Node model
 */
class TextNodeModel extends NodeModel {

    constructor(public value: string = '',
                public parent: TagModel = null) {
        super();
    }

    public render(controller: Controller): Node {
        const $textNode = document.createTextNode('');
        $textNode.nodeValue = parseBits.curlyBindings(this.value, controller);
        return $textNode;
    }
}

/**
 * Describes Element Node model
 */
class TagModel extends NodeModel {
    public controller: Controller;

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
    public appendChild(element: NodeModel): void {
        this.children.push(element);
        element.parent = this;
    }

    /**
     * Render self and all it's children if there is any
     * @param controller {Controller}
     * @returns {HTMLElement}
     */
    public render(controller: Controller = null): HTMLElement {
        const element = document.createElement(this.name);
        // add event handlers
        for (const attr of this.attrs) {
            // handle attribute if it is event handler declaration
            if (attr.name.indexOf('on:') === 0) {
                const eventName = 'on' + attr.name.substring(3);
                const [fm, methodName, parameters] = attr.value.match(/(\w+)\((.*?)\)/);
                const paramsArray = parameters.replace(/\s/gm, '').split(',');
                element[eventName] = function (this, event) {
                    // convert parameters names to point to controller's properties
                    for (const i in paramsArray) {
                        switch (paramsArray[i]) {
                            case '$event':
                                paramsArray[i] = event;
                                break;
                            case '$this':
                                paramsArray[i] = this;
                                break;
                            default:
                                paramsArray[i] = controller[paramsArray[i]];
                                break;
                        }
                    }
                    // call controller's method by extracted name with extracted parameters
                    controller[methodName].apply(controller, paramsArray);
                };
            } else {
                element.setAttributeNode(attr.render(controller));
            }
        }
        for (const child of this.children) {
            element.appendChild(child.render(controller));
        }
        return element;
    }
}

export {TagModel, TextNodeModel, AttributeModel, NodeModel, Controller};
