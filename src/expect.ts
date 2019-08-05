const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.use(chaiAsPromised).expect;
export { expect };

// Remove chai & chai as promised OR add to documentation that reuqired devDependencies with both @types