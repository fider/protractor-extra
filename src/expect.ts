const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

let _expect = chai.use(chaiAsPromised).expect;
export { _expect as expect };

export function setInternalExpect(expect: any) {
    _expect = expect;
}

// Remove chai & chai as promised OR add to documentation that reuqired devDependencies with both @types