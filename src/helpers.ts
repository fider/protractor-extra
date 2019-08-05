import { browser } from 'protractor';

export async function dismissAlert() {
    return await browser.switchTo().alert().dismiss();
}