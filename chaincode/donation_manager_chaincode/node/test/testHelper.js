const sinon = require("sinon");

/**
 * Test Helper: creates stubFunctions for stub and returns it
 *
 * @function createStubAndStubFunctions
 */
function createStubAndStubFunctions(functionNames) {
  const stub = {
    getFunctionAndParameters: () => {},
    getTxID: () => {},
    getArgs: () => {},
    getTxTimestamp: () => {},
    getState: () => {},
    putState: () => {},
    deleteState: () => {},
    getHistoryForKey: () => {}
  };

  let stubFunctions = {};
  functionNames.map(functionName => {
    if (!Object.keys(stub).includes(functionName)) {
      throw new Error("invalid stub function name");
    }
    stubFunctions[functionName] = sinon.stub(stub, functionName);
  });

  return { stubFunctions, stub };
}

/**
 * Test Helper: convert Buffer to JSON
 *
 * @function bufferToJSON
 */
function bufferToJSON(buffer) {
  try {
    const response =
      buffer.toString() === "undefined" ? null : JSON.parse(buffer.toString());
    return response;
  } catch (error) {
    throw new Error(`Error parsing value to JSON: ${buffer.toString()}.`);
  }
}

module.exports = {
  createStubAndStubFunctions,
  bufferToJSON
};
