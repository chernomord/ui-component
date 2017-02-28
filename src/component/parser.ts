import {TagModel, AttributeModel, NodeModel, TextNodeModel} from './DOMModel';

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
 * HTML string parser. Transforms HTML string into virtual DOM representation based on DOMModel module classes
 */
class HTMLParser {
    selfClosingTags = selfClosingTags;

    constructor() {
    }

    /**
     * Parse HTML string into DOM Model Tree
     * @param html
     * @returns {TagModel}
     */
    parseHTML(html: string): TagModel {
        let curSegment = html.substring(0);
        let currentParent: TagModel = undefined;
        let modelRoot: TagModel;
        while (curSegment.length > 0) {
            switch (this.tagType(curSegment)) {
                case 1 : // opening tag
                    let {result, restOfHTML} = this.extractTag(curSegment);
                    let tag = this.parseTag(result);
                    if (currentParent) {
                        currentParent.appendChild(tag);
                    }
                    if (!modelRoot) {
                        modelRoot = tag;
                    }
                    if (this.selfClosingTags.hasOwnProperty(tag.name)) {
                    } else {
                        currentParent = tag;
                    }
                    curSegment = restOfHTML;
                    break;
                case 2 : // closing tag
                    let a = this.extractTag(curSegment);
                    currentParent = currentParent.parent;
                    curSegment = a.restOfHTML;
                    break;
                case 3 : // text content
                    let b = this.extractTextContent(curSegment);
                    let textNode = this.parseText(b.result);
                    currentParent.appendChild(textNode);
                    curSegment = b.restOfHTML;
                    break;
                default:
                    break;
            }
        }
        return modelRoot
    }

    /**
     * Extracts result from beginning of the input string
     * @param html
     * @returns {{result: string, restOfHTML: string}}
     */
    extractTag(html: string) {
        let closingIndex = html.indexOf(">", 1);
        let result = html.substring(0, closingIndex + 1);
        let restOfHTML = html.substr(closingIndex + 1, html.length);
        return {result, restOfHTML}
    }

    /**
     *
     * @param html
     * @returns {{result: string, restOfHTML: string}}
     */
    extractTextContent(html: string) {
        let textEndId = html.indexOf('<');
        let result = html.substring(0, textEndId);
        let restOfHTML = html.substring(textEndId);
        return {result, restOfHTML}
    }

    /**
     * Parse tag string (open or closing) into TagModel instance
     * @param tagString
     * @returns {TagModel}
     */
    parseTag(tagString: string) {
        let attrs: AttributeModel[] = [];
        let [match, tag, attributesStr] = tagString.match(/<(\w+)[\s+]?([^>]+)?>/);
        if (attributesStr) {
            let attrStrings = [];
            attributesStr.replace(/((on:)?\w+[$="]\D[^"]*["])/g, (match, attrFrag) => {
                attrStrings.push(this.parseAttribute(attrFrag));
                return match;
            });
            for (let attr of attrStrings) {
                attrs.push(attr);
            }
        }
        return new TagModel(tag, attrs)
    }

    /**
     * Parse attr string into AttributeModel instance
     * @param attr
     * @returns {AttributeModel}
     */
    parseAttribute(attr: string) {
        let [name, value] = attr.split('=');
        value = (value) ? value.trim() : undefined;
        value = (value) ? value.replace(/['"]+/g, '') : '';
        return new AttributeModel(name, value);
    }

    /**
     * Parse input into TextNodeModel instance
     * @param text
     * @returns {TextNodeModel}
     */
    parseText(text: string) {
        return new TextNodeModel(text);
    }

    /**
     * Determine type of the tag at the beginning of the string: Open, Closing or Text Content
     * @param HTMLString
     * @returns {number}
     */
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

}

export {HTMLParser}