const shim = require("fabric-shim");
const util = require("util");

const Validations = require("./services/validations");
const Helpers = require("./services/helpers");

class DonationManager {
  /**
   * @dev Initialize chaincode: DonationManager
   */
  async Init(stub) {
    console.info("========= Donation Manager Init =========");
    const ret = stub.getFunctionAndParameters();
    const args = ret.params;

    try {
      Validations.checkArgsLength(args, 0);
      return shim.success();
    } catch (err) {
      return shim.error(err);
    }
  }

  /**
   * @dev Invoke functions of DonationManager chaincode
   */
  async Invoke(stub) {
    console.info("======== Donation Manager Invoke ========");
    console.info("Transaction ID: " + stub.getTxID());
    console.info(util.format("Args: %j", stub.getArgs()));
    const ret = stub.getFunctionAndParameters();

    const method = this[ret.fcn];
    if (!method) {
      console.error(`No method of name: ${ret.fcn} found`);
      return shim.error();
    }

    try {
      const payload = await method(stub, ret.params, this);
      return shim.success(payload);
    } catch (error) {
      console.error(error);
      return shim.error(error);
    }
  }

  /**
   * @dev Read donation using the transaction ID of the donation
   */
  async readDonation(stub, args) {
    Validations.checkArgsLength(args, 1);
    Validations.equalsLength(args[0], 64);

    const donationId = args[0];
    console.info(`Query for Donation ID: ${donationId}`);

    let donationData = await stub.getState(donationId);
    Validations.checkSuccessfulStateRetrieval(donationData);
    donationData = Helpers.defaultToUndefinedIfEmpty(donationData);

    const response = {
      key: donationId,
      value: Helpers.bufferToJSON(donationData)
    };
    console.info("Query Response:");
    console.info(util.format(response));
    return Helpers.toBuffer(response);
  }

  /**
   * @dev Query multiple donation IDs
   */
  async readMultipleDonations(stub, donationIds) {
    Validations.isArray(donationIds);

    let response = {};
    console.info(`Query for Donation IDs: ${donationIds}`);

    // Get the state from the ledger
    for (let i = 0; i < donationIds.length; i++) {
      const donationId = donationIds[i];
      Validations.equalsLength(donationId, 64);
      let donationData = await stub.getState(donationId);
      Validations.checkSuccessfulStateRetrieval(donationData);
      donationData = Helpers.defaultToUndefinedIfEmpty(donationData);

      response[donationId] = {
        key: donationId,
        value: Helpers.bufferToJSON(donationData)
      };
    }

    console.info("Query Response:");
    console.info(util.format(response));
    return Helpers.toBuffer(response);
  }

  /**
   * @dev Check whether a donation exists in the state store
   */
  async isPresent(stub, args) {
    Validations.checkArgsLength(args, 1);
    Validations.equalsLength(args[0], 64);
    const donationId = args[0];
    const donationData = await stub.getState(donationId);
    const response = { exists: !Helpers.isEmpty(donationData) };
    return Helpers.toBuffer(response);
  }

  /**
   * @dev get history of a given donation ID
   */
  async getHistoryForDonation(stub, args) {
    Validations.checkArgsLength(args, 1);
    Validations.equalsLength(args[0], 64);
    const donationId = args[0];
    console.info("Get history for Donation ID: %s\n", donationId);

    const resultsIterator = await stub.getHistoryForKey(donationId);
    const results = await Helpers.getAllResults(resultsIterator, true);

    return Helpers.jsonToBuffer(results);
  }

  /**
   * @dev AddDonation function representing creation of a donation
   * Storing it against a unique transaction ID
   */
  async addDonation(stub, donationData) {
    Validations.checkArgsLength(donationData, 3);
    const timestamp = stub.getTxTimestamp();
    const validity = Validations.checkDonationArgsType(donationData);

    donationData[3] = timestamp;
    donationData[4] = validity;
    const donationObj = Helpers.formatToJson(donationData);
    const donationId = stub.getTxID();

    const bufferedDonation = Helpers.jsonToBuffer(donationObj);
    try {
      await stub.putState(donationId, bufferedDonation);

      const result = { donationId };
      return Helpers.toBuffer(result);
    } catch (error) {
      throw new Error(
        `Failed to create state for Donation ID: ${donationId}. Received ${error}`
      );
    }
  }

  /**
   * @dev Update function representing update of a donation using Donation ID
   */
  async updateDonation(stub, updatedDonationData) {
    const donationId = updatedDonationData[0];
    Validations.equalsLength(donationId, 64);
    Validations.checkArgsLengthIsWithinRange(updatedDonationData, 3, 7);
    const updatedDonationJson = await Helpers.createUpdateJson(
      updatedDonationData.slice(1)
    );

    const { project, itemType, amount } = updatedDonationJson;
    try {
      const fetchedState = await stub.getState(donationId);
      Validations.throwIfEmpty(fetchedState);
      let donationObj = Helpers.bufferToJSON(fetchedState);

      if (project) donationObj.project = project;
      if (itemType) donationObj.itemType = itemType;
      if (amount) donationObj.amount = amount;

      donationObj.timestamp = stub.getTxTimestamp();
      donationObj.validity = Validations.checkDonationArgsType([
        donationObj.project,
        donationObj.itemType,
        donationObj.amount
      ]);

      const bufferedDonation = Helpers.jsonToBuffer(donationObj);
      await stub.putState(donationId, bufferedDonation);
      const result = { donationId, updateTx: await stub.getTxID() };
      return Helpers.toBuffer(result);
    } catch (error) {
      throw new Error(
        `Failed to update state for Donation ID: ${donationId}. Received ${error}`
      );
    }
  }

  /**
   * @dev Deletes a donation entity from state store
   */
  async removeDonation(stub, donationData) {
    Validations.checkArgsLength(donationData, 1);
    Validations.equalsLength(donationData[0], 64);
    const donationId = donationData[0];

    try {
      const fetchedState = await stub.getState(donationId);
      Validations.throwIfEmpty(fetchedState);

      // Delete the key from the state in ledger
      await stub.deleteState(donationId);

      const result = { donationId, deleteTx: await stub.getTxID() };
      return Helpers.toBuffer(result);
    } catch (error) {
      throw new Error(
        `Failed to delete state for Donation ID: ${donationId}. Received ${error}`
      );
    }
  }
}

shim.start(new DonationManager());
