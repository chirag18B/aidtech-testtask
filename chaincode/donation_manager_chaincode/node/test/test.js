const assert = require("assert");
const sinon = require("sinon");
const DonationManager = require("../donationManager");

describe("DonationManager", function() {
  let donation;
  before(() => {
    donation = new DonationManager();
  });

  describe("Init", function() {
    it("should init successfully when passed with zero arguments", function() {
      const stub = {
        getFunctionAndParameters: () => {}
      };

      const callback = sinon.stub(stub, "getFunctionAndParameters");
      callback.returns({ fcn: "init", params: ["a", "c"] });

      donation.Init(stub);
      // assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });

  describe("Invoke", function() {
    describe("readDonation", function() {});
    describe("readMultipleDonations", function() {});
    describe("isPresent", function() {});
    describe("getHistoryForDonation", function() {});
    describe("addDonation", function() {});
    describe("updateDonation", function() {});
    describe("removeDonation", function() {});
  });
});
