import { browser, ExpectedConditions as EC, ElementFinder } from 'protractor';
import ms = require('ms');
import * as expectModule from './expect';
import { textToRegExp, ft as ft, falseIfMissing, _patternToBePresentInElementAttribute, timeToMs } from './internal-helpers';



// ---------------------------------------------------------
//  waitCondition defaults
// ---------------------------------------------------------
type WaitStateTimouts = {
    alertPresent?: number,
    clickable?: number,
    text?: number,
    textInValue?: number,
    titleContains?: number,
    titleIs?: number,
    urlContains?: number,
    urlIs?: number,
    present?: number,
    stale?: number,
    visible?: number,
    invisible?: number,
    selected?: number,
};



const defaultWaitStateTimeouts: Required<WaitStateTimouts> = {
    alertPresent: ms('10 s'),
    clickable: ms('10 s'),
    text: ms('10 s'),
    textInValue: ms('10 s'),
    titleContains: ms('10 s'),
    titleIs: ms('10 s'),
    urlContains: ms('10 s'),
    urlIs: ms('10 s'),
    present: ms('10 s'),
    stale: ms('10 s'),
    visible: ms('10 s'),
    invisible: ms('10 s'),
    selected: ms('10 s'),
};



export function setDefaultWaitStateTimeouts(defaults: WaitStateTimouts) {
    Object.assign(defaultWaitStateTimeouts, defaults);
}



// ---------------------------------------------------------
//  waitCondition implementation
// ---------------------------------------------------------
/**
 * @param message [RegExp|string|null]
 *      String - Full match
 *      RegExp - Partial match
 *      Null   - message is not validated
 * @param timeoutMs [number]  timeout for alertIsPresent
 */
export async function waitAlertPresent(message: RegExp | string | null = null, timeoutMs: number | string = defaultWaitStateTimeouts.alertPresent) {
    timeoutMs =  timeToMs(timeoutMs);

    await browser.wait(EC.alertIsPresent(), timeoutMs, `Expected alert to be present in less than ${ft(timeoutMs)}.`);

    if (message) {
        message = textToRegExp(message, 'fullMatch');
        let actualText = await browser.switchTo().alert().getText();
        expectModule.expect(actualText, `waitAlertPresent(). Expected text: ${message}. Actual text: ${actualText}`).to.match(message);
    }
}



/**
 * @param text [string|RegExp]
 *      String - Partial match
 *      RegExp - Partial match (full with /^...$/)
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitTitleContains(text: string, timeoutMs: number | string = defaultWaitStateTimeouts.titleContains) {
    timeoutMs =  timeToMs(timeoutMs);

    let expectedText = textToRegExp(text, 'partialMatch');

    function _titleContainsPattern(pattern: RegExp) {
        return () => {
            return browser.driver.getTitle().then((title: string): boolean => {
                return pattern.test(title);
            });
        };
    }

    // TODO check built-in message and modify it if it is not clear enough
    return browser.wait( _titleContainsPattern(expectedText), timeoutMs );
}



/**
 * @param title [string|RegExp]
 *      String - Full match
 *      RegExp - Partial match (full with /^...$/)
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitTitleIs(title: string, timeoutMs: number | string = defaultWaitStateTimeouts.titleIs) {
    timeoutMs =  timeToMs(timeoutMs);

    let expectedTitle = textToRegExp(title, 'fullMatch');

    function _titleContainsPattern(pattern: RegExp) {
        return () => {
            return browser.driver.getTitle().then((actualTitle: string): boolean => {
                return pattern.test(actualTitle);
            });
        };
    }

    return browser.wait( _titleContainsPattern(expectedTitle), timeoutMs );
}



/**
 * @param url [string|RegExp]
 *      String - Partial match
 *      RegExp - Partial match (full with /^...$/)
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitUrlContains(url: string, timeoutMs: number | string = defaultWaitStateTimeouts.urlContains) {
    timeoutMs =  timeToMs(timeoutMs);

    let expectedUrl = textToRegExp(url, 'partialMatch');

    function _urlContainsPattern(pattern: RegExp) {
        return () => {
            return browser.driver.getCurrentUrl().then((actualUrl: string): boolean => {
                return pattern.test(actualUrl);
            });
        };
    }

    return browser.wait( _urlContainsPattern(expectedUrl), timeoutMs );
}



/**
 * @param url [string|RegExp]
 *      String - Full match
 *      RegExp - Partial match (full with /^...$/)
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitUrlIs(url: string, timeoutMs: number | string = defaultWaitStateTimeouts.urlIs) {
    timeoutMs =  timeToMs(timeoutMs);

    let expectedUrl = textToRegExp(url, 'fullMatch');

    function _urlContainsPattern(pattern: RegExp) {
        return () => {
            return browser.driver.getCurrentUrl().then((actualUrl: string): boolean => {
                return pattern.test(actualUrl);
            });
        };
    }

    return browser.wait( _urlContainsPattern(expectedUrl), timeoutMs );
}


// ---------------------------------------------------------
//  ElementFinder content/attribute check
// ---------------------------------------------------------
function _patternToBePresentInElement(theElement: ElementFinder, expectedText: RegExp) {
    let hasPattern = () => {
      return theElement.getText().then((actualText: string): boolean => {
        // MSEdge does not properly remove newlines, which causes false
        // negatives
        return expectedText.test( actualText.replace(/\r?\n|\r/g, '') );
      }, falseIfMissing);
    };
    return EC.and(EC.presenceOf(theElement), hasPattern);
}


/**
 * @param theElement [ElementFinder]
 * @param text [string|RegExp]
 *      String - Partial match
 *      RegExp - Partial match (full with /^...$/)
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitTextContains(theElement: ElementFinder, text: string | RegExp, timeoutMs: number | string = defaultWaitStateTimeouts.text) {
    timeoutMs =  timeToMs(timeoutMs);

    let expectedText = textToRegExp(text, 'partialMatch');

    return browser.wait(_patternToBePresentInElement(theElement, expectedText), timeoutMs, `waitText() timeout after ${ft(timeoutMs)}. Expected elem "${theElement.locator()}" to contain text "${expectedText}". Actual text "${await theElement.getText()}"`);
}


/**
 * @param theElement [ElementFinder]
 * @param text [string|RegExp]
 *      String - Full match
 *      RegExp - Partial match (full with /^...$/)
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitTextIs(theElement: ElementFinder, text: string | RegExp, timeoutMs: number | string = defaultWaitStateTimeouts.text) {
    timeoutMs =  timeToMs(timeoutMs);

    let expectedText = textToRegExp(text, 'fullMatch');

    // TODO check if it will wait for text to update if initial text is incorrect
    return browser.wait(_patternToBePresentInElement(theElement, expectedText), timeoutMs, `waitText() timeout after ${ft(timeoutMs)}. Expected elem "${theElement.locator()}" to contain text "${expectedText}". Actual text "${await theElement.getText()}"`);
}


/**
 * @param theElement
 * @param text
 *      String to full match.
 *      RegExp to partial match (full with /^...$/).
 * @param [timeoutMs]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitTextInValueIs(theElement: ElementFinder, text: string | RegExp, timeoutMs: number | string = defaultWaitStateTimeouts.textInValue) {
    timeoutMs =  timeToMs(timeoutMs);

    let expectedText = textToRegExp(text, 'fullMatch');

    return browser.wait(_patternToBePresentInElementAttribute(theElement, 'value', expectedText), timeoutMs, `waitText() timeout after ${ft(timeoutMs)}. Expected elem "${theElement.locator()}" to contain text "${expectedText}". Actual text "${await theElement.getText()}"`);
}



// ---------------------------------------------------------
//  ElementFinder state check
// ---------------------------------------------------------

/**
 * VISIBLE and ENABLED
 *
 * @param theElement [ElementFinder]
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitClickable(theElement: ElementFinder, timeoutMs: number | string = defaultWaitStateTimeouts.clickable) {
    timeoutMs =  timeToMs(timeoutMs);

    return browser.wait(EC.elementToBeClickable(theElement), timeoutMs, `Element  "${theElement.locator()}"  not clickable in ${ft(timeoutMs)}.`);
}



/**
 * @param theElement [ElementFinder]
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitPresent(theElement: ElementFinder, timeoutMs: number | string = defaultWaitStateTimeouts.present) {
    timeoutMs =  timeToMs(timeoutMs);

    return browser.wait(EC.presenceOf(theElement), timeoutMs, `Expected element "${theElement.locator()}" to be present in DOM in less than ${ft(timeoutMs)}.`);
}


/**
 * @param theElement [ElementFinder]
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitStale(theElement: ElementFinder, timeoutMs: number | string = defaultWaitStateTimeouts.stale) {
    timeoutMs =  timeToMs(timeoutMs);

    return browser.wait(EC.stalenessOf(theElement), timeoutMs, `Expected element "${theElement.locator()}" to be removed from DOM (stale) in less than ${ft(timeoutMs)}.`);
}



/**
 * @param theElement [ElementFinder]
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitVisible(theElement: ElementFinder, timeoutMs: number | string = defaultWaitStateTimeouts.visible) {
    timeoutMs =  timeToMs(timeoutMs);

    return browser.wait(EC.visibilityOf(theElement), timeoutMs, `Expected element "${theElement.locator()}" to be visible in less than ${ft(timeoutMs)}.`);
}



/**
 * @param theElement [ElementFinder]
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitInvisible(theElement: ElementFinder, timeoutMs: number | string = defaultWaitStateTimeouts.invisible) {
    timeoutMs =  timeToMs(timeoutMs);

    return browser.wait(EC.invisibilityOf(theElement), timeoutMs, `Expected element "${theElement.locator()}" to be INvisible in less than ${ft(timeoutMs)}.`);
}



/**
 *
 * @param theElement [ElementFinder]
 * @param timeoutMs [number|string]  number or "ms" module formatted string eg. '12s'.
 */
export async function waitSelected(theElement: ElementFinder, timeoutMs: number | string = defaultWaitStateTimeouts.selected) {
    timeoutMs =  timeToMs(timeoutMs);

    return browser.wait(EC.elementToBeSelected(theElement), timeoutMs, `Expected element "${theElement.locator()}" to be selected in less than ${ft(timeoutMs)}.`);
}
