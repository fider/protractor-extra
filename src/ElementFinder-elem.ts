import { ElementOptions } from './ElementFinder-declaration';
import { ElementFinder, Locator, element, by } from 'protractor';
import { _addWaitHooksToElementBasingOnElementOptions } from './ElementFinder-waitStateBeforeAction';



// ---------------------------------------------------------
//      elem()
// ---------------------------------------------------------

ElementFinder.prototype.elem = elem;


/**
 * Wrapper for protractor.element() with extra optional hooks.
 * @param locator
 * @param [options]
 */
export function elem(this: any, locator: Locator, options?: ElementOptions) {


    let theElement: ElementFinder;

    if (this instanceof ElementFinder) {
        // TODO inherit options from parent + override it with current options
        theElement = this.element(locator);
    }
    else {
        theElement = element(locator);
    }


    theElement.options = options || {timeouts: {}};
    _addWaitHooksToElementBasingOnElementOptions(theElement);
    return theElement;
}



// ---------------------------------------------------------
//      elemByAttr()
// ---------------------------------------------------------

ElementFinder.prototype.elemByAttr = elemByAttr;


let elemByAttrPrefix = '';

export function setElemByAttrPrefix(prefix: string) {
    elemByAttrPrefix = prefix;
}


const selectorAndNthChildRegExp = /([\w-]*)(\[([1-9]{1}[0-9]*)\])?/;


/**
 * Wrapper for protractorExtra.elem(). Search by attribute name `elemByAttr('test-id-submit-btn')`
 * or provide global attribute prefix using `setElemByAttrPrefix('test-id-')`
 * and then use only `elemByAttr('submit-btn')`
 *
 * @param attributeSelector same as by.css but wraps each word into square brackets,
 *              so in fact it is looking for html attribute name.
 * @param [options]
 */
export function elemByAttr(this: any, attributeSelector: string, options?: ElementOptions) {
    const cssAttributeSelector: string = attributeSelector
        .split(' ')
        .map( (subSelector) => {

            // Validate part of selector
            let subSelectorParts = selectorAndNthChildRegExp.exec(subSelector);
            if ( ! subSelectorParts) {
                throw new Error(`elemByAttr("${attributeSelector}") invalid subSelector: "${subSelector}"`);
            }

            // Handle nth-child [index] syntax: `selectorName[nthChild]`
            let [_fullMatch, attrSuffix, _numWithSquareBrackets, nthChild] = subSelectorParts;
            nthChild = nthChild ? `:nth-child(${nthChild})` : '';
            if (  (!nthChild)  &&  (subSelector.includes('[') || subSelector.includes(']'))  ) {
                throw new Error(`elemByAttr("${attributeSelector}") selector argument error. SubSelector="${subSelector}". Invalid index[] value. Expected "selectorName[index]" to contain index starting with 1.`);
            }

            return `[${elemByAttrPrefix}${attrSuffix}]${nthChild}`;
        })
        .join(' ');

    let locator: Locator = by.css(cssAttributeSelector);

    let theElement: ElementFinder;

    if (this instanceof ElementFinder) {
        // TODO inherit options from parent + override it with current options
        theElement = this.elem(locator, options);
    }
    else {
        theElement = elem(locator, options);
    }


    return theElement;
}
