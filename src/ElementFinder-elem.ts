import { ElementOptions, defaultElementOptions } from './ElementFinder-declaration';
import { ElementFinder, Locator, element, by, $ } from 'protractor';
import { _addWaitHooksToElementBasingOnElementOptions } from './ElementFinder-waitStateBeforeAction';



// ---------------------------------------------------------
//      elementExtra()
// ---------------------------------------------------------

ElementFinder.prototype.x$           = elementExtra;
ElementFinder.prototype.elementExtra = elementExtra;

export const x$ = elementExtra;

/**
 * Wrapper for protractor.element() with extra optional hooks.
 * @param locator
 * @param [options]
 */
export function elementExtra(this: any, locatorOrCssSelector: string | Locator, options?: ElementOptions) {

    options = options || {timeouts: {}};
    Object.assign(options.timeouts, defaultElementOptions.timeouts);

    let locator: Locator;
    if (typeof locatorOrCssSelector === 'string') {
        locator = $(locatorOrCssSelector);
    }
    else {
        locator = locatorOrCssSelector;
    }

    let theElement: ElementFinder;

    if (this instanceof ElementFinder) {
        // TODO inherit options from parent + override it with current options
        theElement = this.element(locator);
    }
    else {
        theElement = element(locator);
    }


    theElement.options = options;
    _addWaitHooksToElementBasingOnElementOptions(theElement);
    return theElement;
}



// ---------------------------------------------------------
//      elementExtraByAttr()
// ---------------------------------------------------------

ElementFinder.prototype.xA                 = elementExtraByAttr;
ElementFinder.prototype.elementExtraByAttr = elementExtraByAttr;

export const xA = elementExtraByAttr;


let elemByAttrPrefix = '';

export function setElementExtraByAttrPrefix(prefix: string) {
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
export function elementExtraByAttr(this: any, attributeSelector: string, options?: ElementOptions) {
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
        theElement = this.elementExtra(locator, options);
    }
    else {
        theElement = elementExtra(locator, options);
    }


    return theElement;
}
