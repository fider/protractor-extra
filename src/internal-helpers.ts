import { ElementOptions, ElementOptions_Normalized } from './ElementFinderExtra';
import { ElementFinder, ExpectedConditions as EC } from 'protractor';
import escapeStringRegexp from 'escape-string-regexp';
const mergeOptions = require('merge-options');


// TODO setBrowser, setExpect


export function normalizeElementOptions(options: ElementOptions = {timeouts: {}}): ElementOptions_Normalized {

    // deep copy
    const normalizedOptions: ElementOptions_Normalized = mergeOptions(options);

    // normalize timeout string values (convert to millis)
    for (let [key, value] of Object.entries(options.timeouts)) {
        (normalizedOptions.timeouts as any)[key] = timeToMs(value as any);
    }

    return normalizedOptions;
}


/**
 * @param text [string|RegExp]
 *      String - returns full match RegExp. Special characters escaped.
 *      RegExp - returns the same RegExp.
 */
export function textToRegExp(text: string | RegExp, match: 'fullMatch' | 'partialMatch') {
    let result: RegExp;
    let fullMatch =  (match === 'fullMatch');

    if (typeof text === 'string') {
        result = new RegExp(`${fullMatch ? '^' : ''}${escapeStringRegexp(text)}${fullMatch ? '$' : ''}`);
    }
    else {
        result = text;
    }
    return result;
}

export function formatTime(timeMs: number) {
    let unit: 's' | 'ms';
    let divisor: number;

    if (timeMs >= 1000) {
        unit = 's';
        divisor = 1000;
    }
    else {
        unit = 'ms';
        divisor = 1;
    }

    return  `${timeMs / divisor}${unit}`;
}


export function timeToMs(timeOrMsTime: number | string) {
    let timeMs: number;

    if (typeof timeOrMsTime === 'string') {
        timeMs = ms(timeOrMsTime);

        if ( ! timeMs) {
            throw new Error(`Invalid string time value provided "${timeOrMsTime}". Module "ms" is unable to parse it. Expected number or valid "ms" module time: https://www.npmjs.com/package/ms`);
        }
    }
    else {
        timeMs = timeOrMsTime;
    }

    return timeMs;
}



// ====================================================================================================
//   Taken from protractor
// ====================================================================================================


import {error as wderror} from 'selenium-webdriver';
import ms = require('ms');

export function falseIfMissing(error: any) {
    if (    (error instanceof wderror.NoSuchElementError) ||
            (error instanceof wderror.StaleElementReferenceError)) {
        return false;
    } else {
         throw error;
    }
}

export function _EC_patternToBePresentInElementAttribute(elementFinder: ElementFinder, attribute: string, text: RegExp) {
    let _hasPatternInPropertyValue = () => {
      return elementFinder.getAttribute(attribute).then((actualText: string): boolean => {
        return text.test( actualText );
      }, falseIfMissing);
    };
    return EC.and(EC.presenceOf(elementFinder), _hasPatternInPropertyValue);
}

export function _EC_elementHasClass(elementFinder: ElementFinder, className: string) {
    let _hasClass = () => {
      return elementFinder.getAttribute('class').then((classes: string): boolean => {
        return classes.split(' ').includes(className);
      }, falseIfMissing);
    };
    return EC.and(EC.presenceOf(elementFinder), _hasClass);
}