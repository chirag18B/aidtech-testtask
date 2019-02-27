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

  describe("Invoke", () => {
    describe("addDonation", () => {
      it("should fail if number of arguments not equal three", async () => {
        const { stubFunctions, stub } = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState"
        ]);

        stubFunctions.getFunctionAndParameters.returns({
          fcn: "addDonation",
          params: ["ITU", "toys", "1", "unexpected arg"]
        });
        stubFunctions.getTxID.returns(
          "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        );
        stubFunctions.getTxTimestamp.returns({
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 72402371
        });
        stubFunctions.getArgs.returns(["addDonation", "ITU", "toys", "1"]);

        const response = await donation.Invoke(stub);
        const { status, message } = response;
        assert.equal(status, 500);
        assert.equal(
          message,
          "Error: Invalid number of arguments. Expected 3, got 4 in args: ITU,toys,1,unexpected arg."
        );
      });

      it("should set validity false if project is invalid", async () => {
        const addResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState"
        ]);

        const addStubFunctions = addResult.stubFunctions;
        const addStub = addResult.stub;

        addStubFunctions.getFunctionAndParameters.returns({
          fcn: "addDonation",
          params: ["ITUa", "toys", "1"]
        });
        addStubFunctions.getTxID.returns(
          "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        );
        addStubFunctions.getTxTimestamp.returns({
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 72402371
        });
        addStubFunctions.getArgs.returns(["addDonation", "ITU", "toys", "1"]);

        const addDonationResponse = await donation.Invoke(addStub);
        const { status, message, payload } = addDonationResponse;
        assert.equal(status, 200);
        assert.equal(message, "");
        assert.deepEqual(bufferToJSON(payload), {
          donationId:
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        });

        const readResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getState"
        ]);

        const readStubFunctions = readResult.stubFunctions;
        const readStub = readResult.stub;

        readStubFunctions.getFunctionAndParameters.returns({
          fcn: "readDonation",
          params: [
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
          ]
        });
        readStubFunctions.getTxID.returns(
          "32d0867a0c247dd6904cc00fa6f2ec8b162ed2fb788067605da54906e4cf6626"
        );
        readStubFunctions.getArgs.returns([
          "readDonation",
          "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        ]);
        const expectedResult = {
          key:
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70",
          value: {
            project: "ITUa",
            itemType: "toys",
            amount: "1",
            timestamp: {
              seconds: { low: 1551188076, high: 0, unsigned: false },
              nanos: 72402371
            },
            validity: false
          }
        };
        readStubFunctions.getState.returns(
          Buffer.from(JSON.stringify(expectedResult.value))
        );
        const readDonationResponse = await donation.Invoke(readStub);
        assert.equal(readDonationResponse.status, 200);
        assert.equal(readDonationResponse.message, "");
        assert.equal(
          bufferToJSON(readDonationResponse.payload).value.validity,
          false
        );
      });

      it("should set validity false if itemType is invalid", async () => {
        const addResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState"
        ]);

        const addStubFunctions = addResult.stubFunctions;
        const addStub = addResult.stub;

        addStubFunctions.getFunctionAndParameters.returns({
          fcn: "addDonation",
          params: ["ITU", "toyss", "1"]
        });
        addStubFunctions.getTxID.returns(
          "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        );
        addStubFunctions.getTxTimestamp.returns({
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 72402371
        });
        addStubFunctions.getArgs.returns(["addDonation", "ITU", "toys", "1"]);

        const addDonationResponse = await donation.Invoke(addStub);
        const { status, message, payload } = addDonationResponse;
        assert.equal(status, 200);
        assert.equal(message, "");
        assert.deepEqual(bufferToJSON(payload), {
          donationId:
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        });

        const readResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getState"
        ]);

        const readStubFunctions = readResult.stubFunctions;
        const readStub = readResult.stub;

        readStubFunctions.getFunctionAndParameters.returns({
          fcn: "readDonation",
          params: [
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
          ]
        });
        readStubFunctions.getTxID.returns(
          "32d0867a0c247dd6904cc00fa6f2ec8b162ed2fb788067605da54906e4cf6626"
        );
        readStubFunctions.getArgs.returns([
          "readDonation",
          "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        ]);
        const expectedResult = {
          key:
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70",
          value: {
            project: "ITUa",
            itemType: "toyss",
            amount: "1",
            timestamp: {
              seconds: { low: 1551188076, high: 0, unsigned: false },
              nanos: 72402371
            },
            validity: false
          }
        };
        readStubFunctions.getState.returns(
          Buffer.from(JSON.stringify(expectedResult.value))
        );
        const readDonationResponse = await donation.Invoke(readStub);
        assert.equal(readDonationResponse.status, 200);
        assert.equal(readDonationResponse.message, "");
        assert.equal(
          bufferToJSON(readDonationResponse.payload).value.validity,
          false
        );
      });

      it("should set validity false if amount is invalid", async () => {
        const addResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState"
        ]);

        const addStubFunctions = addResult.stubFunctions;
        const addStub = addResult.stub;

        addStubFunctions.getFunctionAndParameters.returns({
          fcn: "addDonation",
          params: ["ITU", "toys", "1a1"]
        });
        addStubFunctions.getTxID.returns(
          "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        );
        addStubFunctions.getTxTimestamp.returns({
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 72402371
        });
        addStubFunctions.getArgs.returns(["addDonation", "ITU", "toys", "1"]);

        const addDonationResponse = await donation.Invoke(addStub);
        const { status, message, payload } = addDonationResponse;
        assert.equal(status, 200);
        assert.equal(message, "");
        assert.deepEqual(bufferToJSON(payload), {
          donationId:
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        });

        const readResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getState"
        ]);

        const readStubFunctions = readResult.stubFunctions;
        const readStub = readResult.stub;

        readStubFunctions.getFunctionAndParameters.returns({
          fcn: "readDonation",
          params: [
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
          ]
        });
        readStubFunctions.getTxID.returns(
          "32d0867a0c247dd6904cc00fa6f2ec8b162ed2fb788067605da54906e4cf6626"
        );
        readStubFunctions.getArgs.returns([
          "readDonation",
          "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        ]);
        const expectedResult = {
          key:
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70",
          value: {
            project: "ITUa",
            itemType: "toys",
            amount: "1a1",
            timestamp: {
              seconds: { low: 1551188076, high: 0, unsigned: false },
              nanos: 72402371
            },
            validity: false
          }
        };
        readStubFunctions.getState.returns(
          Buffer.from(JSON.stringify(expectedResult.value))
        );
        const readDonationResponse = await donation.Invoke(readStub);
        assert.equal(readDonationResponse.status, 200);
        assert.equal(readDonationResponse.message, "");
        assert.equal(
          bufferToJSON(readDonationResponse.payload).value.validity,
          false
        );
      });

      it("should create donation with said ID", async () => {
        const addResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState"
        ]);

        const addStubFunctions = addResult.stubFunctions;
        const addStub = addResult.stub;

        addStubFunctions.getFunctionAndParameters.returns({
          fcn: "addDonation",
          params: ["ITU", "toys", "1"]
        });
        addStubFunctions.getTxID.returns(
          "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        );
        addStubFunctions.getTxTimestamp.returns({
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 72402371
        });
        addStubFunctions.getArgs.returns(["addDonation", "ITU", "toys", "1"]);

        const addDonationResponse = await donation.Invoke(addStub);
        const { status, message, payload } = addDonationResponse;
        assert.equal(status, 200);
        assert.equal(message, "");
        assert.deepEqual(bufferToJSON(payload), {
          donationId:
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        });
      });

      it("should create donation with said timestamp", async () => {
        const addResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState"
        ]);

        const addStubFunctions = addResult.stubFunctions;
        const addStub = addResult.stub;

        addStubFunctions.getFunctionAndParameters.returns({
          fcn: "addDonation",
          params: ["ITU", "toys", "1"]
        });
        addStubFunctions.getTxID.returns(
          "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        );
        addStubFunctions.getTxTimestamp.returns({
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 72402371
        });
        addStubFunctions.getArgs.returns(["addDonation", "ITU", "toys", "1"]);

        const addDonationResponse = await donation.Invoke(addStub);
        const { status, message, payload } = addDonationResponse;
        assert.equal(status, 200);
        assert.equal(message, "");
        assert.deepEqual(bufferToJSON(payload), {
          donationId:
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        });

        const readResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getState"
        ]);

        const readStubFunctions = readResult.stubFunctions;
        const readStub = readResult.stub;

        readStubFunctions.getFunctionAndParameters.returns({
          fcn: "readDonation",
          params: [
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
          ]
        });
        readStubFunctions.getTxID.returns(
          "32d0867a0c247dd6904cc00fa6f2ec8b162ed2fb788067605da54906e4cf6626"
        );
        readStubFunctions.getArgs.returns([
          "readDonation",
          "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70"
        ]);
        const expectedResult = {
          key:
            "01443d662f2d4eff15b8d37b530b259e981c2ba1ffb37c01144a4a02dce95e70",
          value: {
            project: "ITUa",
            itemType: "toys",
            amount: "1",
            timestamp: {
              seconds: { low: 1551188076, high: 0, unsigned: false },
              nanos: 72402371
            },
            validity: false
          }
        };
        readStubFunctions.getState.returns(
          Buffer.from(JSON.stringify(expectedResult.value))
        );
        const readDonationResponse = await donation.Invoke(readStub);
        assert.equal(readDonationResponse.status, 200);
        assert.equal(readDonationResponse.message, "");
        assert.deepEqual(
          bufferToJSON(readDonationResponse.payload).value.timestamp,
          expectedResult.value.timestamp
        );
      });
    });
  });
});
