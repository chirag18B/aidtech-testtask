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

    describe("updateDonation", () => {
      it("should fail if donation ID length is not 64", async () => {
        const { stubFunctions, stub } = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState",
          "getState"
        ]);

        stubFunctions.getFunctionAndParameters.returns({
          fcn: "updateDonation",
          params: [
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b",
            "itemType",
            "project",
            "amount",
            "grains",
            "WHO",
            "22"
          ]
        });
        stubFunctions.getTxID.returns(
          "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf"
        );
        stubFunctions.getTxTimestamp.returns({
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 72402371
        });
        stubFunctions.getArgs.returns([
          "updateDonation",
          "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b",
          "itemType",
          "project",
          "amount",
          "grains",
          "WHO",
          "22"
        ]);

        const response = await donation.Invoke(stub);
        const { status, message } = response;
        assert.equal(status, 500);
        assert.equal(
          message,
          "Error: Invalid number of arguments. Expected 64, got 63 in args: 337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b."
        );
      });

      it("should fail if number of arguments passed is smaller than 3", async () => {
        const { stubFunctions, stub } = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState",
          "getState"
        ]);

        stubFunctions.getFunctionAndParameters.returns({
          fcn: "updateDonation",
          params: [
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
            "itemType"
          ]
        });
        stubFunctions.getTxID.returns(
          "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf"
        );
        stubFunctions.getTxTimestamp.returns({
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 72402371
        });
        stubFunctions.getArgs.returns([
          "updateDonation",
          "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
          "itemType"
        ]);

        const response = await donation.Invoke(stub);
        const { status } = response;
        assert.equal(status, 500);
      });

      it("should fail if number of arguments passed is greater than 7", async () => {
        const { stubFunctions, stub } = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState",
          "getState"
        ]);

        stubFunctions.getFunctionAndParameters.returns({
          fcn: "updateDonation",
          params: [
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
            "itemType",
            "project",
            "amount",
            "grains",
            "WHO",
            "22",
            "unexpectedArg"
          ]
        });
        stubFunctions.getTxID.returns(
          "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf"
        );
        stubFunctions.getTxTimestamp.returns({
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 72402371
        });
        stubFunctions.getArgs.returns([
          "updateDonation",
          "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
          "itemType",
          "project",
          "amount",
          "grains",
          "WHO",
          "22",
          "unexpectedArg"
        ]);

        const response = await donation.Invoke(stub);
        const { status } = response;
        assert.equal(status, 500);
      });

      it("should fail if state retrived for given ID is empty", async () => {
        const { stubFunctions, stub } = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState",
          "getState"
        ]);

        stubFunctions.getFunctionAndParameters.returns({
          fcn: "updateDonation",
          params: [
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
            "itemType",
            "project",
            "amount",
            "grains",
            "WHO",
            "22"
          ]
        });
        stubFunctions.getTxID.returns(
          "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf"
        );
        stubFunctions.getTxTimestamp.returns({
          seconds: { low: 1551188076, high: 0, unsigned: false },
          nanos: 72402371
        });
        stubFunctions.getArgs.returns([
          "updateDonation",
          "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
          "itemType",
          "project",
          "amount",
          "grains",
          "WHO",
          "22"
        ]);
        stubFunctions.getState.returns("");

        const response = await donation.Invoke(stub);
        const { status, message } = response;
        assert.equal(status, 500);
        assert.equal(
          message,
          "Error: Failed to update state for Donation ID: 337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3. Received Error: Donation data is absent OR no state registered."
        );
      });

      it("should update timestamp", async () => {
        const updateResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState",
          "getState"
        ]);

        const updateFn = updateResult.stubFunctions;
        const updateStub = updateResult.stub;

        updateFn.getFunctionAndParameters.returns({
          fcn: "updateDonation",
          params: [
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
            "itemType",
            "project",
            "amount",
            "grains",
            "WHO",
            "22"
          ]
        });
        updateFn.getTxID.returns(
          "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf"
        );
        updateFn.getTxTimestamp.returns({
          seconds: { low: 1551207120, high: 0, unsigned: false },
          nanos: 715574022
        });
        updateFn.getArgs.returns([
          "updateDonation",
          "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
          "itemType",
          "project",
          "amount",
          "grains",
          "WHO",
          "22"
        ]);
        const expectedResult1 = {
          key:
            "b4351dc14c6b95590eac29c0b02b42760a91b2f83b35d850f9494f5cc9788807",
          value: {
            project: "ITU",
            itemType: "toys",
            amount: "1",
            timestamp: {
              seconds: { low: 1551188076, high: 0, unsigned: false },
              nanos: 72402371
            },
            validity: false
          }
        };
        updateFn.getState.returns(
          Buffer.from(JSON.stringify(expectedResult1.value))
        );
        const response = await donation.Invoke(updateStub);
        const { status } = response;
        assert.equal(status, 200);

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
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3"
          ]
        });
        readStubFunctions.getTxID.returns(
          "32d0867a0c247dd6904cc00fa6f2ec8b162ed2fb788067605da54906e4cf6626"
        );
        readStubFunctions.getArgs.returns([
          "readDonation",
          "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3"
        ]);
        const expectedResult2 = {
          key:
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
          value: {
            project: "WHO",
            itemType: "grains",
            amount: "22",
            timestamp: {
              seconds: { low: 1551207120, high: 0, unsigned: false },
              nanos: 715574022
            },
            validity: true
          }
        };
        readStubFunctions.getState.returns(
          Buffer.from(JSON.stringify(expectedResult2.value))
        );
        const readDonationResponse = await donation.Invoke(readStub);
        assert.equal(readDonationResponse.status, 200);
        assert.equal(readDonationResponse.message, "");
        assert.deepEqual(
          bufferToJSON(readDonationResponse.payload).value.timestamp,
          expectedResult2.value.timestamp
        );
      });

      it("should update validity", async () => {
        const updateResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState",
          "getState"
        ]);

        const updateFn = updateResult.stubFunctions;
        const updateStub = updateResult.stub;

        updateFn.getFunctionAndParameters.returns({
          fcn: "updateDonation",
          params: [
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
            "itemType",
            "project",
            "amount",
            "grains",
            "WHOa",
            "22"
          ]
        });
        updateFn.getTxID.returns(
          "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf"
        );
        updateFn.getTxTimestamp.returns({
          seconds: { low: 1551207120, high: 0, unsigned: false },
          nanos: 715574022
        });
        updateFn.getArgs.returns([
          "updateDonation",
          "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
          "itemType",
          "project",
          "amount",
          "grains",
          "WHO",
          "22"
        ]);
        const expectedResult1 = {
          key:
            "b4351dc14c6b95590eac29c0b02b42760a91b2f83b35d850f9494f5cc9788807",
          value: {
            project: "ITU",
            itemType: "toys",
            amount: "1",
            timestamp: {
              seconds: { low: 1551188076, high: 0, unsigned: false },
              nanos: 72402371
            },
            validity: false
          }
        };
        updateFn.getState.returns(
          Buffer.from(JSON.stringify(expectedResult1.value))
        );
        const response = await donation.Invoke(updateStub);
        const { status } = response;
        assert.equal(status, 200);

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
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3"
          ]
        });
        readStubFunctions.getTxID.returns(
          "32d0867a0c247dd6904cc00fa6f2ec8b162ed2fb788067605da54906e4cf6626"
        );
        readStubFunctions.getArgs.returns([
          "readDonation",
          "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3"
        ]);
        const expectedResult2 = {
          key:
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
          value: {
            project: "WHOa",
            itemType: "grains",
            amount: "22",
            timestamp: {
              seconds: { low: 1551207120, high: 0, unsigned: false },
              nanos: 715574022
            },
            validity: false
          }
        };
        readStubFunctions.getState.returns(
          Buffer.from(JSON.stringify(expectedResult2.value))
        );
        const readDonationResponse = await donation.Invoke(readStub);
        assert.equal(readDonationResponse.status, 200);
        assert.equal(readDonationResponse.message, "");
        assert.deepEqual(
          bufferToJSON(readDonationResponse.payload).value.validity,
          false
        );
      });

      it("should return updateTx and donationId", async () => {
        const updateResult = createStubAndStubFunctions([
          "getFunctionAndParameters",
          "getTxID",
          "getArgs",
          "getTxTimestamp",
          "putState",
          "getState"
        ]);

        const updateFn = updateResult.stubFunctions;
        const updateStub = updateResult.stub;

        updateFn.getFunctionAndParameters.returns({
          fcn: "updateDonation",
          params: [
            "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
            "itemType",
            "project",
            "amount",
            "grains",
            "WHO",
            "22"
          ]
        });
        updateFn.getTxID.returns(
          "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf"
        );
        updateFn.getTxTimestamp.returns({
          seconds: { low: 1551207120, high: 0, unsigned: false },
          nanos: 715574022
        });
        updateFn.getArgs.returns([
          "updateDonation",
          "337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3",
          "itemType",
          "project",
          "amount",
          "grains",
          "WHO",
          "22"
        ]);
        const expectedResult1 = {
          key:
            "b4351dc14c6b95590eac29c0b02b42760a91b2f83b35d850f9494f5cc9788807",
          value: {
            project: "ITU",
            itemType: "toys",
            amount: "1",
            timestamp: {
              seconds: { low: 1551188076, high: 0, unsigned: false },
              nanos: 72402371
            },
            validity: false
          }
        };
        updateFn.getState.returns(
          Buffer.from(JSON.stringify(expectedResult1.value))
        );
        const response = await donation.Invoke(updateStub);
        const { status, message, payload } = response;
        assert.equal(status, 200);
        assert.equal(
          payload.toString(),
          '{"donationId":"337a9dbc0fc982c8d46150b3198c182d82a5bf540f27a56cfnf2edc8a2ea19b3","updateTx":"684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf"}'
        );
      });
    });
  });
});
