const assert = require("assert");
const sinon = require("sinon");
const DonationManager = require("../src/donationManager");

describe("DonationManager", () => {
  let donation = null;
  before(() => {
    donation = new DonationManager();
  });

  describe("Init", () => {
    it("should init successfully when passed with zero arguments", () => {
      const stub = {
        getFunctionAndParameters: () => {}
      };
      const callback = sinon.stub(stub, "getFunctionAndParameters");
      callback.returns({ fcn: "init", params: [] });

      const response = donation.Init(stub);
      const { status, message, payload } = response;
      assert.equal(status, 200);
      assert.equal(message, "");
    });

    it("should fail when passed with one or more arguments", () => {
      const stub = {
        getFunctionAndParameters: () => {}
      };
      const callback = sinon.stub(stub, "getFunctionAndParameters");
      callback.returns({ fcn: "init", params: ["unexpected param"] });

      const response = donation.Init(stub);
      const { status, message, payload } = response;
      assert.equal(status, 500);
      assert.equal(
        message,
        "Error: Invalid number of arguments. Expected 0, got 1 in args: unexpected param."
      );
    });
  });

  describe("Invoke", () => {
    describe("addDonation", () => {});
    describe("updateDonation", () => {});
    describe("removeDonation", () => {});
    describe("readDonation", () => {});
    describe("readMultipleDonations", () => {});
    describe("isPresent", () => {});
    describe("getHistoryForDonation", () => {});
  });
});
