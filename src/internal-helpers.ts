import { ElementFinder, ExpectedConditions as EC } from 'protractor';
import escapeStringRegexp from 'escape-string-regexp';

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

export function ft(timeMs: number) {
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

    return  `${timeMs / divisor}[${unit}]`;
}


export function timeToMs(timeOrMsTime: number | string) {
    let timeMs: number;

    if (typeof timeOrMsTime === 'string') {
        timeMs = ms(timeOrMsTime);

        if ( ! timeOrMsTime) {
            throw new Error(`Invalid ElementOptions time provided ${timeOrMsTime}. Expected number or valid "ms" module time: https://www.npmjs.com/package/ms`);
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

export function _patternToBePresentInElementAttribute(elementFinder: ElementFinder, attribute: string, text: RegExp) {
    let hasPatternInPropertyValue = () => {
      return elementFinder.getAttribute(attribute).then((actualText: string): boolean => {
        return text.test( actualText );
      }, falseIfMissing);
    };
    return EC.and(EC.presenceOf(elementFinder), hasPatternInPropertyValue);
}
