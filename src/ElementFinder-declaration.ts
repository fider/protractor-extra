import { Locator, ElementFinder } from 'protractor';
import ms = require('ms');
import deepCopy from 'deep-copy';


// ====================================================================================================
// Update protractor prototype
// ====================================================================================================


// ---------------------------------------------------------
//      Declaration update
// ---------------------------------------------------------

declare module 'protractor' {
    interface ElementFinder {

        options: ElementOptions;

        // ---------------------------------------------------------
        //      private  ElementFinder::wait<STATE>Before<ACTION>()
        // ---------------------------------------------------------
        elem(subLocator: Locator, options?: ElementOptions): ElementFinder;
        elemByAttr(attributeSelector: string, options?: ElementOptions): ElementFinder;

        // ---------------------------------------------------------
        //      public  ElementFinder::elemByTID()
        // ---------------------------------------------------------
        // TODO add elemByTID


        // ---------------------------------------------------------
        //      public  ElementFinder::wait<STATE>()
        // ---------------------------------------------------------

        // Content/attribute check
        waitTextContains(  text: string | RegExp,  timeoutMs?: number | string ): void;
        waitTextIs(        text: string | RegExp,  timeoutMs?: number | string ): void;
        waitTextInValueIs(   text: string | RegExp,  timeoutMs?: number | string ): void;

        // State check
        waitClickable(timeoutMs?: number | string): void;
        waitPresent(timeoutMs?: number | string): void;
        waitStale(timeoutMs?: number | string): void;
        waitVisible(timeoutMs?: number | string): void;
        waitInvisible(timeoutMs?: number | string): void;
        waitSelected(timeoutMs?: number | string): void;

    }
}



Object.defineProperty(ElementFinder.prototype, 'options', {
    get() {
        this._options = this._options || {};
        return this._options;
    },
    set(options: ElementOptions = {timeouts: {}}) {
        this._options = this._options || {};
        Object.assign(this._options, deepCopy(options));
    }
});



export type ElementOptions = {
    timeouts: ElementTimeouts;
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



export type ElementOptions_Full = {
    timeouts: {[K in keyof Required<ElementTimeouts>]: number};
};



export const defaultElementOptions: ElementOptions_Full = {
    timeouts: {

        waitVisibleBeforeClick:      ms('10s'),
        waitClickableBeforeClick:    ms('10s'),
        waitClickableBeforeClear:    ms('10s'),
        waitClickableBeforeSendKeys: ms('10s'),

        // Content/attribute check
        waitTextContains:   ms('10s'),
        waitTextIs:         ms('10s'),
        waitTextInValueIs:  ms('10s'),

        // State check
        waitClickable:  ms('10s'),
        waitPresent:    ms('10s'),
        waitStale:      ms('10s'),
        waitVisible:    ms('10s'),
        waitInvisible:  ms('10s'),
        waitSelected:   ms('10s'),
    }
};