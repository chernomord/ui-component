import {TagModel, AttributeModel, NodeModel, TextNodeModel} from './DOMModel';

/**
 * HTML string parser. Transforms HTML string into virtual DOM representations
 */
class HTMLParser {
    constructor() {

    }

    /**
     *
     * @param html
     * @returns {NodeModel}
     */
    parseHTMLString(html: string): NodeModel {
        let pointer: NodeModel;

        return <NodeModel>{}
    }

    parseAttributeFragment(attrFrag: string): AttributeModel {
        return <AttributeModel>{}
    }

    parseTextNodeFragment(textNodeFrag: string): TextNodeModel {
        let textEndId = textNodeFrag.indexOf('<');
        let textValue = textNodeFrag.substring(0, textEndId);
        let restOfHTML = textNodeFrag.substring(textEndId);
        let textNode = new TextNodeModel(textValue, new TagModel(''));
        return textNode
    }

    parseTagFragment(tagFrag: string): TagModel {
        return <TagModel>{}
    }

    /**
     *
     * @param html
     * @returns {{tag: string, restOfHTML: string}}
     */
    extractTag(html: string) {
        let closingIndex = html.indexOf(">", 1);
        let tag = html.substring(0, closingIndex + 1);
        let restOfHTML = html.substr(closingIndex + 1, html.length);
        return {tag, restOfHTML}
    }

    /**
     *
     * @param html
     * @returns {{textValue: string, restOfHTML: string}}
     */
    extractTextContent(html: string) {
        let textEndId = html.indexOf('<');
        let textValue = html.substring(0, textEndId);
        let restOfHTML = html.substring(textEndId);
        return {textValue, restOfHTML}
    }

    /**
     *
     * @param tagString
     * @returns {{tagName: string, attrs: string[]}}
     */
    parseTag(tagString: string) {
        let tagName: string;
        let attrs: string[] = [];
        let [match, tag, attributesStr] = tagString.match(/<(\w+)[\s+]?([^>]+)?>/);
        tagName = tag;
        if (attributesStr) {
            let attrStrings = [];
            attributesStr.replace(/(\w+[$="]\D[^"]*["])/g, (match, g1) => {
                attrStrings.push(g1);
                return match;
            });
            for (let attr of attrStrings) {
                attrs.push(attr);
            }
        }
        return {tagName, attrs}
    }

}

export {HTMLParser}