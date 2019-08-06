import { ElementFinder } from 'protractor';



// ---------------------------------------------------------
//      Internal helpers
// ---------------------------------------------------------

export function _addWaitHooksToElementBasingOnElementOptions(theElement: ElementFinder) {

    _waitVisibleBeforeClick( theElement );
    _waitClickableBeforeClick( theElement );
    _waitClickableBeforeClear( theElement );
    _waitClickableBeforeSendKeys( theElement );
}



function _waitVisibleBeforeClick(theElement: ElementFinder) {
    let timeout = theElement.options.timeouts.waitVisibleBeforeClick;

    if ( ! timeout) {
        return;
    }

    const legacyClick = theElement.click.bind(theElement);
    theElement.click = async function _waitVisibleThenClick(...args: any[]) {
        await theElement.waitVisible(timeout);
        return (legacyClick as any)(...args);
    };
}


function _waitClickableBeforeClick(theElement: ElementFinder) {
    let timeout = theElement.options.timeouts.waitClickableBeforeClick;

    if ( ! timeout) {
        return;
    }

    const legacyClick = theElement.click.bind(theElement);
    theElement.click = async function _waitClickableThenClick(...args: any[]) {
        await theElement.waitClickable(timeout);
        return (legacyClick as any)(...args);
    };
}


function _waitClickableBeforeClear(theElement: ElementFinder) {
    let timeout = theElement.options.timeouts.waitClickableBeforeClear;

    if ( ! timeout) {
        return;
    }

    const legacyClear = theElement.clear.bind(theElement);
    theElement.clear = async function _waitClickableThenClear(...args: any[]) {
        await theElement.waitClickable(timeout);
        return (legacyClear as any)(...args);
    };
}


function _waitClickableBeforeSendKeys(theElement: ElementFinder) {
    let timeout = theElement.options.timeouts.waitClickableBeforeSendKeys;

    if ( ! timeout) {
        return;
    }

    const legacySendKeys = theElement.sendKeys.bind(theElement);
    theElement.sendKeys = async function _waitClickableThenSendKeys(...args: any[]) {
        await theElement.waitClickable(timeout);
        return legacySendKeys(...args);
    };
}


// ---------------------------------------------------------
//      Less important internal helpers
// ---------------------------------------------------------


// // Resolve string values (eg '4s') and 'default' value to numbers.
// function _normalizeElementOptions(options: ElementOptions): _NormalizedElementOptions {

//     const normalizedOptions: _NormalizedElementOptions = {};

//     for (let [key, value] of Object.entries(options)) {
//         let time: number | undefined = _normalizeTime(value, default_waitStateTimeouts, key);

//         if ( ! time) {
//             throw new Error(`Invalid ElementOptions value provided.`
//                 + `\nKey="${key}" Value="${time}".`
//                 + `\nExpected Value to be number|string|'default', where string should be valid positive 'ms' module input (https://www.npmjs.com/package/ms).`
//                 + `\nProvided options=${inspect(options)}.`
//             );
//         }

//         if (time < 0) {
//             throw new Error(`Invalid (negative) ElementOptions value provided.`
//                 + `\nKey="${key}" Value="${time}".`
//                 + `\nExpected Value to be number|string|'default', where string should be valid positive 'ms' module input (https://www.npmjs.com/package/ms).`
//                 + `\nProvided options=${inspect(options)}.`
//             );
//         }

//         (normalizedOptions as any)[key] = time;
//     }

//     return normalizedOptions;
// }


// function _normalizeTime(
//         timeMs: number | string | 'default' | undefined,
//         defaultValuesMap: {[index: string]: number},
//         defaultKey: string
//             ): number | undefined {

//     let normalizedTime: number | undefined;

//     if (typeof timeMs === 'string') {
//         if (timeMs === 'default') {
//             normalizedTime = defaultValuesMap[defaultKey];
//         }
//         else {
//             let numberValue = ms(timeMs);

//             normalizedTime = numberValue;
//         }
//     }
//     else {
//         normalizedTime = timeMs;
//     }

//     return normalizedTime;
// }