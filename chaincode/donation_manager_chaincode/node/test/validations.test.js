const assert = require("assert");
const validations = require("../src/validations");

describe("checkDonationArgsType", function () {

  it("should return false when pass an array of project test", function () {
    var result = validations.checkDonationArgsType(['test', 'test', '3.2']);
    assert.equal(result, false);
  });

  it("should return true when pass an array of project FAO", function () {
    var result = validations.checkDonationArgsType(['FAO', 'water', '3.2']);
    assert.equal(result, true);
  });

});

describe("isValidAmount", function () {

  it("should return true when pass a valid number 87", function () {
    var result = validations.isValidAmount(87);
    assert.equal(result, true);
  });

});

describe("isValidItemType", function () {

  it("should return true if item passed is valid (water)", function () {
    var result = validations.isValidItemType("water");
    assert.equal(result, true);
  });

  it("should return false if item passed is valid (test)", function () {
    var result = validations.isValidItemType("test");
    assert.equal(result, false);
  });
});

describe("isValidProject", function () {

  it("should return true if project passed is valid (FAO)", function () {
    var result = validations.isValidProject("FAO");
    assert.equal(result, true);
  });

  it("should return false if project passed is invalid (test)", function () {
    var result = validations.isValidProject("test");
    assert.equal(result, false);
  });

});

describe("throwIfEmpty", function () {

  it("should return error when pass an empty object or string", async function () {
    try {
      validations.throwIfEmpty("")
      assert.fail('should have thrown before');
    } catch (error) {
      assert.equal(error.message, "Donation data is absent OR no state registered.");

    }
  });

  it("should not return error when pass an valid object string or array", async function () {
    try {
      validations.throwIfEmpty("test")
    } catch (error) {
      assert.equal(error.message, "Donation data is absent OR no state registered.");

    }
  });

});

describe("checkSuccessfulStateRetrieval", function () {
  it("should return error when pass an empty object or string or zero", async function () {
    try {
      validations.checkSuccessfulStateRetrieval(0)
      assert.fail('should have thrown before');
    } catch (error) {
      assert.equal(error.message, "Failed to get state.");

    }
  });

  it("should not return error when pass an valid object string or array", async function () {
    try {
      validations.checkSuccessfulStateRetrieval("test")
    } catch (error) {
      assert.equal(error.message, "Failed to get state.");

    }
  });

});


describe("isArray", function () {

  it("should return error when pass an non-array", async function () {
    try {
      validations.isArray(123)
      assert.fail('should have thrown before');
    } catch (error) {
      assert.equal(error.message, "Invalid argument type. Expected array, got number 123.");
    }
  });

  it("should not return error when pass an valid array", async function () {
    try {
      validations.isArray([1, 2])
    } catch (error) {
      assert.equal(error.message, "Failed to get state.");

    }
  });

});

describe("checkArgsLengthIsWithinRange", function () {

  it("should return error when pass an string an incorect expected length", async function () {
    try {
      validations.checkArgsLengthIsWithinRange('test', 2, 3)
      assert.fail('should have thrown before');
    } catch (error) {
      assert.equal(error.message, `Invalid number of arguments. Expected length between 2-3, got 4 in args: test.`);
    }
  });

  it("should not return error when pass an string and expeccted correct length", async function () {
    try {
      validations.checkArgsLengthIsWithinRange('test', 2, 5)
    } catch (error) {
      assert.equal(error.message, "Failed to get state.");

    }
  });

});

describe("checkLength", function () {

  it("should return error when pass an string an incorect expected length", async function () {
    try {
      validations.checkLength('test', 2)
      assert.fail('should have thrown before');
    } catch (error) {
      assert.equal(error.message, `Invalid number of arguments. Expected 2, got 4 in args: test.`);
    }
  });

  it("should not return error when pass an string and valid expected length", async function () {
    try {
      validations.checkLength('test', 4)
    } catch (error) {
      assert.equal(error.message, "Failed to get state.");

    }
  });

});