const assert = require("assert");

const DonationManager = require("../src/donationManager");
const { createStubAndStubFunctions, bufferToJSON } = require("./testHelper");

describe("DonationManager", () => {
  let donation = null;
  before(() => {
    donation = new DonationManager();
  });

  describe("Init", () => {
    it("should fail when passed with one or more arguments", () => {
      const { stubFunctions, stub } = createStubAndStubFunctions([
        "getFunctionAndParameters"
      ]);
      stubFunctions.getFunctionAndParameters.returns({
        fcn: "init",
        params: ["unexpected param"]
      });

      const response = donation.Init(stub);
      const { status, message } = response;
      assert.equal(status, 500);
      assert.equal(
        message,
        "Error: Invalid number of arguments. Expected 0, got 1 in args: unexpected param."
      );
    });

    it("should init successfully when passed with zero arguments", () => {
      const { stubFunctions, stub } = createStubAndStubFunctions([
        "getFunctionAndParameters"
      ]);

      stubFunctions.getFunctionAndParameters.returns({
        fcn: "init",
        params: []
      });

      const response = donation.Init(stub);
      const { status, message } = response;
      assert.equal(status, 200);
      assert.equal(message, "");
    });
  });
});
