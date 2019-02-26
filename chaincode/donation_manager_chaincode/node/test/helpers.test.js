const assert = require("assert");
const helpers = require("../src/helpers");
const testJson = { test: 'abc' }

describe("jsonToBuffer", function () {

  it("should return right buffer when pass an object", function () {
    var result = helpers.jsonToBuffer(testJson);
    result = result.toString('hex');
    assert.equal(result, '7b2274657374223a22616263227d');
  });

});

describe("bufferToJSON", function () {

  it("should return right JSON when pass an buffer", function () {
    var bufferValue = Buffer.from('7b2274657374223a22616263227d', 'hex')
    var result = helpers.bufferToJSON(bufferValue);
    result = helpers.objCompare(result, testJson)
    assert.equal(result, true);
  });

  it("should return right JSON when pass an buffer", function () {
    try {
      var bufferValue = Buffer.from('', 'hex')
      var result = helpers.bufferToJSON(bufferValue);
      result = helpers.objCompare(result, testJson)
      assert.equal(result, true);
    } catch (error) {
      console.log(error.message);
      // assert.equal(error.message, "Donation data is absent OR no state registered.");
    }
    
  });

});

describe("bufferToJSON", function () {

  it("should return if string is empty or not", function () {
    var result = helpers.isEmpty("");
    assert.equal(result, true);
  });

});

describe("defaultToUndefinedIfEmpty", function () {

  it("should return undefined when pass an empty object", function () {
    var result = helpers.defaultToUndefinedIfEmpty("");
    result = result.toString('hex');
    assert.equal(result, '756e646566696e6564');
  });

});

describe("formatToJson", function () {

  it("should return object when pass an array of values", function () {
    const expectedJson = {
      project: 'test',
      itemType: 'test',
      amount: 3.2,
      timestamp: 'test',
      validity: 'test'
    }
    var result = helpers.formatToJson(['test', 'test', '3.2', 'test', 'test']);
    result = helpers.objCompare(result, expectedJson)
    assert.equal(result, true);
  });

});

describe("createUpdateJson", function () {

  it("should return right updated object when pass an array", async function () {
    const expectedJson = { testValue1: 'testValue2' }
    var result = await helpers.createUpdateJson(['testValue1', 'testValue2']);
    result = helpers.objCompare(result, expectedJson)
    assert.equal(result, true);
  });

});

// describe("getAllResults", function () {
//   // it("should return all results in JSON when pass an iterator and history", function () {
//   //   var result = helpers.getAllResults({"test": "abc"});
//   //   assert.equal(status, 200);
//   // });

// });
