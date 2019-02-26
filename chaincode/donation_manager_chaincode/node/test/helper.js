const sinon = require("sinon");

/**
 * Test Helper: creates callback for stub and returns it
 *
 * @function createStubAndCallback
 */
function createStubAndCallback(functionName) {
  const stub = {
    getFunctionAndParameters: () => {}
  };

  const callback = sinon.stub(stub, functionName);

  return { callback, stub };
}

module.exports = {
  createStubAndCallback
};
