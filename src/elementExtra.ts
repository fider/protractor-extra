import { ElementOptions } from './ElementFinderExtra';
import { ElementFinder, Locator, element, by, $ } from 'protractor';
import { _addWaitHooksToElementBasingOnElementOptions } from './internal-pre-action-hooks';
import { normalizeElementOptions } from './internal-helpers';
const mergeOptions = require('merge-options');


let userDefinedDefaultExtraOptions: ElementOptions = {timeouts: {}};


export function setDefaultElementOptions(options: ElementOptions) {
    userDefinedDefaultExtraOptions = mergeOptions(userDefinedDefaultExtraOptions, options);
}


// ---------------------------------------------------------
//      elementExtra()
// ---------------------------------------------------------


/**
 * Wrapper for protractor.element() with extra optional hooks.
 * @param locator
 * @param [options]
 */
export function x$(this: void | ElementFinder, locatorOrCssSelector: string | Locator, options?: ElementOptions) {


    let locator: Locator;
    if (typeof locatorOrCssSelector === 'string') {
        locator = $(locatorOrCssSelector);
    }
    else {
        locator = locatorOrCssSelector;
    }

    let theElement: ElementFinder;

    if (this instanceof ElementFinder) {
        theElement = this.element(locator);
        options = mergeOptions(this.options, options);
    }
    else {
        theElement = element(locator);
    }


    // Extra additions
    const emptyOptions: ElementOptions = {timeouts: {}};
    const normalizedOptions = normalizeElementOptions(
        mergeOptions(emptyOptions, userDefinedDefaultExtraOptions, options)
    );
    theElement.options = normalizedOptions;

    _addWaitHooksToElementBasingOnElementOptions(theElement);


    return theElement;
}



// ---------------------------------------------------------
//      elementExtraByAttr()
// ---------------------------------------------------------



let defaultXAttrPrefix = '';


export function setXAttrPrefix(prefix: string) {
    defaultXAttrPrefix = prefix;
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
export function xAttr(this: void | ElementFinder, attributeSelector: string, options: ElementOptions = {timeouts: {}}) {

    let theElementFinderExtra: ElementFinder;
    let xAttrPrefix: string;


    if (this instanceof ElementFinder) {
        xAttrPrefix = options.xAttrPrefix || this.options.xAttrPrefix || '';
        options = mergeOptions(options, this.options);
    }
    else {
        xAttrPrefix = options.xAttrPrefix || defaultXAttrPrefix || '';
    }


    const locator = _xAttr(xAttrPrefix, attributeSelector);


    if (this instanceof ElementFinder) {
        theElementFinderExtra = this.x$(locator, options);
    }
    else {
        theElementFinderExtra = x$(locator, options);
    }


    return theElementFinderExtra;
}



export function _xAttr(attrPrefix: string, attributeSelector: string) {

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

            return `[${attrPrefix}${attrSuffix}]${nthChild}`;
        })
        .join(' ');

    let locator: Locator = by.css(cssAttributeSelector);

    return locator;
}