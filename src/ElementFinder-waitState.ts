import { ElementFinder } from 'protractor';
import { waitTextIs, waitTextContains, waitTextInValueIs, waitSelected, waitInvisible, waitVisible, waitStale, waitPresent, waitClickable } from './waitConditions';



// ---------------------------------------------------------
//      Implementation:  content/attribute check
// ---------------------------------------------------------

ElementFinder.prototype.waitTextContains = async function _waitTextContains(text: string | RegExp, timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitTextContains;
    waitTextContains(this, text, timeoutMs);
};

ElementFinder.prototype.waitTextIs = async function _waitTextIs(text: string | RegExp, timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitTextIs;
    waitTextIs(this, text, timeoutMs);
};

ElementFinder.prototype.waitTextInValueIs = async function _waitTextInValueIs(text: string | RegExp, timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitTextInValueIs;
    waitTextInValueIs(this, text, timeoutMs);
};



// ---------------------------------------------------------
//      Implementation:  state check
// ---------------------------------------------------------

ElementFinder.prototype.waitClickable = async function _waitClickable(this: ElementFinder, timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitClickable;
    waitClickable(this, timeoutMs);
};

ElementFinder.prototype.waitPresent = async function _waitPresent(timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitPresent;
    waitPresent(this, timeoutMs);
};

ElementFinder.prototype.waitStale = async function _waitStale(timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitStale;
    waitStale(this, timeoutMs);
};

ElementFinder.prototype.waitVisible = async function _waitVisible(timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitVisible;
    waitVisible(this, timeoutMs);
};

ElementFinder.prototype.waitInvisible = async function _waitInvisible(timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitInvisible;
    waitInvisible(this, timeoutMs);
};

ElementFinder.prototype.waitSelected = async function _waitSelected(timeoutMs?: string | number) {
    timeoutMs = timeoutMs || this.options.timeouts.waitSelected;
    waitSelected(this, timeoutMs);
};
