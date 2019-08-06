import { browser, ElementFinder } from 'protractor';
import { timeToMs } from './internal-helpers';

export async function dismissAlert() {
    // TODO determine if necessare to switchTo previous view.
    return await browser.switchTo().alert().dismiss();
}

export function postClickDelay(theElement: ElementFinder, delayMs: number | string) {
    const delay = timeToMs(delayMs);

    const clickMethod = theElement.click.bind(theElement);
    theElement.click = async function clickWithDelay(...args: any[]) {
        await (clickMethod as any)(...args); // args in case of api update
        return browser.sleep(delay);
    };
}