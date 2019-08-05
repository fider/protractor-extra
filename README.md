# Experimental
Do not use until verion 1.x.x released


- [About](#about)
- [Installation & requirements](#installation-and-requirements)
- [Examples](#examples)
  - [Classic protractor](#classic-protractor)
  - [With protractor-extra](#with-protractor-extra)
- [Documentation](#documentation)

# About
Helpers for protractor and augmentations for protractor ElementFinder.
Work in progress so not yet documented well.

# Installation and requirements
Requires [Node.js](https://nodejs.org/) >= v6
Requires [TypeScript](https://www.npmjs.com/package/typescript) >= v3
Requires [TypeScript](https://www.npmjs.com/package/protractor) >= v5  (tested only with v5.4.2)
```sh
$ npm i -S protractor-extra
```

# Examples

## Classic protractor

```js
  import { element, by, ExpectedConditions, browser } from "protractor";

  const userBtn = element( by.css('#user-btn') );

  async function doSomething() {
    let timeoutMs = config.clickbaleTimeout;
    let failMessage = `Element  "${userBtn.locator()}"  not clickable in ${timeoutMs/1000}s.`;
    await browser.wait(ExpectedConditions.elementToBeClickable(userBtn), timeoutMs, failMessage);
    await userBtn.click();
  }
```

## With protractor-extra
```js
  const { elementByCss } = require("protractor-extra"); // to guarantee sync import
  import { element, by } from "protractor";

  // `default` or any other milliseconds number value may be used
  const userBtn = elementByCss( '#user-btn',  {waitClickableBeforeClick: 'default'}  );

  async function doSomething() {
    await userBtn.click();
  }
```

# Documentation
TODO when v 1.0.0 released

## `module`
- ### `Class` description
  - #### `Class:method` description
- ### `Function` description
