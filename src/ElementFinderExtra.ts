import { ElementOptions } from './ElementFinderExtra';
import { Locator, ElementFinder, browser } from 'protractor';
import { waitTextIs, waitTextContains, waitTextInValueIs, waitSelected, waitInvisible, waitVisible, waitStale, waitPresent, waitClickable } from './wait-conditions';
import { _xAttr, x$, xAttr } from './elementExtra';
const mergeOptions = require('merge-options');



// ====================================================================================================
// Update protractor prototype
// ====================================================================================================


// ---------------------------------------------------------
//      Declaration update
// ---------------------------------------------------------

declare module 'protractor' {
    interface ElementFinder {

        // Options (merges internally after set)
        options: ElementOptions_Normalized;

        // ---------------------------------------------------------
        //      private  ElementFinder::wait<STATE>Before<ACTION>()
        // ---------------------------------------------------------

        /** Child element with Extra Options by locator or css selector string */
        x$(subLocatorOrCssSelector: string | Locator, options?: ElementOptions): ElementFinder;


        /** Child element with Extra Options by Attribute selector */
        xAttr(attributeSelector: string, options?: ElementOptions): ElementFinder;


        /**
         * Set attributeSelector prefix for elementExtraByAttr().
         *
         * Example: Instead of:
         * `xAttr('test-id-user test-id-ok-btn')`
         * you can use:
         * `setElementExtraByAttrPrefix('test-id-'); xAttr('user ok-btn')`
         *
         */
        setXAttrPrefix(prefix: string): void;


        // ---------------------------------------------------------
        //      waitXXX()
        // ---------------------------------------------------------

        // Content/attribute check
        waitTextContains(  text: string | RegExp,  timeoutMs?: number | string ): Promise<void>;
        waitTextIs(        text: string | RegExp,  timeoutMs?: number | string ): Promise<void>;
        waitTextInValueIs(   text: string | RegExp,  timeoutMs?: number | string ): Promise<void>;

        // State check
        waitClickable(timeoutMs?: number | string): Promise<void>;
        waitPresent(timeoutMs?: number | string): Promise<void>;
        waitStale(timeoutMs?: number | string): Promise<void>;
        waitVisible(timeoutMs?: number | string): Promise<void>;
        waitInvisible(timeoutMs?: number | string): Promise<void>;
        waitSelected(timeoutMs?: number | string): Promise<void>;

        hover(visibleTimeout?: string | number): Promise<void>;

    }
}



export type ElementOptions = {
    timeouts: ElementTimeouts;
    xAttrPrefix?: string;
};

export type ElementOptions_Normalized = {
    timeouts: {
        [P in keyof ElementTimeouts]: number;
    };
    xAttrPrefix?: string;
};


type ElementTimeouts = {
    // Pre-action state check timeouts
    waitVisibleBeforeClick?:        number | string;
    waitClickableBeforeClick?:      number | string;
    waitClickableBeforeClear?:      number | string;
    waitClickableBeforeSendKeys?:   number | string;

    // Content/attribute check
    waitTextContains?:  number | string;
    waitTextIs?:        number | string;
    waitTextInValueIs?: number | string;

    // State check
    waitClickable?: number | string;
    waitPresent?:   number | string;
    waitStale?:     number | string;
    waitVisible?:   number | string;
    waitInvisible?: number | string;
    waitSelected?:  number | string;
};



// ---------------------------------------------------------
//      Implementation:  options
// ---------------------------------------------------------

Object.defineProperty(ElementFinder.prototype, 'options', {
    get() {
        const emptyOptions: ElementOptions_Normalized = {timeouts: {}};
        this.__extraOptions = this.__extraOptions || emptyOptions;
        return this.__extraOptions;
    },
    set(options: ElementOptions_Normalized) {
        this.__extraOptions = mergeOptions(this.__extraOptions, options);
    }
});



// ---------------------------------------------------------
//      Implementation:  element extra finders
// ---------------------------------------------------------


ElementFinder.prototype.x$ = x$;


ElementFinder.prototype.xAttr = xAttr;


ElementFinder.prototype.setXAttrPrefix = function _setXAttrPrefix(prefix: string) {
    this.options.xAttrPrefix = prefix;
};


// ---------------------------------------------------------
//      Implementation:  content/attribute check
// ---------------------------------------------------------

ElementFinder.prototype.waitTextContains = async function _waitTextContains(text: string | RegExp, timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitTextContains;
    await waitTextContains(this, text, timeoutMs);
};

ElementFinder.prototype.waitTextIs = async function _waitTextIs(text: string | RegExp, timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitTextIs;
    await waitTextIs(this, text, timeoutMs);
};

ElementFinder.prototype.waitTextInValueIs = async function _waitTextInValueIs(text: string | RegExp, timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitTextInValueIs;
    await waitTextInValueIs(this, text, timeoutMs);
};



// ---------------------------------------------------------
//      Implementation:  state check
// ---------------------------------------------------------

ElementFinder.prototype.waitClickable = async function _waitClickable(this: ElementFinder, timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitClickable;
    await waitClickable(this, timeoutMs);
};

ElementFinder.prototype.waitPresent = async function _waitPresent(timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitPresent;
    await waitPresent(this, timeoutMs);
};

ElementFinder.prototype.waitStale = async function _waitStale(timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitStale;
    await waitStale(this, timeoutMs);
};

ElementFinder.prototype.waitVisible = async function _waitVisible(timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitVisible;
    await waitVisible(this, timeoutMs);
};

ElementFinder.prototype.waitInvisible = async function _waitInvisible(timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitInvisible;
    await waitInvisible(this, timeoutMs);
};

ElementFinder.prototype.waitSelected = async function _waitSelected(timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitSelected;
    await waitSelected(this, timeoutMs);
};



ElementFinder.prototype.hover = async function _hover(visibleTimeout?: string | number) {
    await this.waitVisible(visibleTimeout || this.options.timeouts.waitVisible);
    return browser.actions().mouseMove(this).perform();
};