import {
    AttributeModel,
    TagModel,
    TextNodeModel,
} from './DOMModel';

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
export class HTMLParser {
    public selfClosingTags = selfClosingTags;

    /**
     * Parse HTML string into DOM Model Tree
     * @param html
     * @returns {TagModel}
     */
    public parseHTML(html: string): TagModel {
        let curSegment = html.substring(0);
        let currentParent: TagModel;
        let modelRoot: TagModel;
        while (curSegment.length > 0) {
            switch (this.tagType(curSegment)) {
                case 1 : // opening tag
                    const {result, restOfHTML} = this.extractTag(curSegment);
                    const tag = this.parseTag(result);
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
                    const a = this.extractTag(curSegment);
                    currentParent = currentParent.parent;
                    if (!currentParent) {
                        console.warn('Multiple root elements present!');
                        curSegment = '';
                        break;
                    }
                    curSegment = a.restOfHTML;
                    break;
                case 3 : // text content
                    const b = this.extractTextContent(curSegment);
                    const textNode = this.parseText(b.result);
                    currentParent.appendChild(textNode);
                    curSegment = b.restOfHTML;
                    break;
                default:
                    break;
            }
        }
        return modelRoot;
    }

    /**
     * Extracts result from beginning of the input string
     * @param html
     * @returns {{result: string, restOfHTML: string}}
     */
    public extractTag(html: string) {
        const closingIndex = html.indexOf('>', 1);
        const result = html.substring(0, closingIndex + 1);
        const restOfHTML = html.substr(closingIndex + 1, html.length);
        return {result, restOfHTML};
    }

    /**
     *
     * @param html
     * @returns {{result: string, restOfHTML: string}}
     */
    public extractTextContent(html: string) {
        const textEndId = html.indexOf('<');
        const result = html.substring(0, textEndId);
        const restOfHTML = html.substring(textEndId);
        return {result, restOfHTML};
    }

    /**
     * Parse tag string (open or closing) into TagModel instance
     * @param tagString
     * @returns {TagModel}
     */
    public parseTag(tagString: string) {
        const attrs: AttributeModel[] = [];
        const [match, tag, attributesStr] = tagString.match(/<(\w+)[\s+]?([^>]+)?>/);
        if (attributesStr) {
            const attrStrings = [];
            attributesStr.replace(/((on:)?\w+[$="]\D[^"]*["])/gm, (attrString, attrFrag) => {
                attrStrings.push(this.parseAttribute(attrFrag));
                return attrString;
            });
            for (const attr of attrStrings) {
                attrs.push(attr);
            }
        }
        return new TagModel(tag, attrs);
    }

    /**
     * Parse attr string into AttributeModel instance
     * @param attr
     * @returns {AttributeModel}
     */
    public parseAttribute(attr: string) {
        let [name, value] = attr.split('=');
        value = (value) ? value.trim() : undefined;
        value = (value) ? value.replace(/['"]+/gm, '') : '';
        return new AttributeModel(name, value);
    }

    /**
     * Parse input into TextNodeModel instance
     * @param text
     * @returns {TextNodeModel}
     */
    public parseText(text: string) {
        return new TextNodeModel(text);
    }

    /**
     * Determine type of the tag at the beginning of the string: Open, Closing or Text Content
     * @param HTMLString
     * @returns {number}
     */
    public tagType(HTMLString: string): number {
        enum Types {
            Open = 1,
            Closing,
            Text,
        }
        let type = '';
        if (/^[<]\w/.test(HTMLString)) {
            type = 'Open';
        } else if (/^[<]\/\w/.test(HTMLString)) {
            type = 'Closing';
        } else if (HTMLString.length > 0) {
            type = 'Text';
        }
        return Types[type];
    }

}
