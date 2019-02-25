const shim = require("fabric-shim");
const util = require("util");

const Validations = require("./services/validations");
const Helpers = require("./services/helpers");

/**
 * Provides functionality for DonationManager chaincode
 *
 * @class
 * @requires Validations
 * @requires Helpers
 * @requires shim
 * @requires util
 */
class DonationManager {
  /**
   * Initialize chaincode: DonationManager
   *
   * @constructor Init
   * @param {Object} stub - encapsulates the APIs between the chaincode implementation and the Fabric peer
   * @throws Will throw if number of input arguments is not zero
   * @returns {success} success if Init successful
   */
  Init(stub) {
    console.info("========= Donation Manager Init =========");
    const ret = stub.getFunctionAndParameters();
    console.log("------------------", ret)
    const args = ret.params;

    try {
      Validations.checkLength(args, 0);
      return shim.success();
    } catch (err) {
      return shim.error(err);
    }
  }

  /**
   * Invoke functions of DonationManager chaincode
   * Will be called whenever a chaincode setter or geeter functionality is called
   *
   * @async
   * @function Invoke
   * @param {Object} stub - encapsulates the APIs between the chaincode implementation and the Fabric peer
   * @throws Will throw if the method being called raises an error
   * @returns {Buffer} payload returned by the method being called
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
   * Read donation using the transaction ID of the donation
   *
   * @async
   * @function readDonation
   * @param {Object} stub - encapsulates the APIs between the chaincode implementation and the Fabric peer
   * @param {Array} args - contains donation ID to query
   * @throws Will throw if number of input arguments is not one
   * @throws Will throw if if argument length is not 64
   * @throws Will throw if state retrieval fails
   * @returns {Buffer} donation object for a given donation ID
   */
  async readDonation(stub, args) {
    Validations.checkLength(args, 1);
    Validations.checkLength(args[0], 64);

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
    return Helpers.jsonToBuffer(response);
  }

  /**
   * Query multiple donation IDs
   *
   * @async
   * @function readMultipleDonations
   * @param {Object} stub - encapsulates the APIs between the chaincode implementation and the Fabric peer
   * @param {Array} donationIds - contains donation IDs to query
   * @throws Will throw if donationIds is not an Array
   * @throws Will throw if donationId length is not 64
   * @throws Will throw if state retrieval fails
   * @returns {ArrayBuffer} Array of donation objects for given donation IDs
   */
  async readMultipleDonations(stub, donationIds) {
    Validations.isArray(donationIds);

    let response = {};
    console.info(`Query for Donation IDs: ${donationIds}`);

    // Get the state from the ledger
    for (let i = 0; i < donationIds.length; i++) {
      const donationId = donationIds[i];
      Validations.checkLength(donationId, 64);
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
    return Helpers.jsonToBuffer(response);
  }

  /**
   * Check whether a donation exists in the state store
   *
   * @async
   * @function isPresent
   * @param {Object} stub - encapsulates the APIs between the chaincode implementation and the Fabric peer
   * @param {Array} args - contains donation ID to query
   * @throws Will throw if number of input arguments is not one
   * @throws Will throw if if argument length is not 64
   * @returns {Buffer} Object containing bool values
   */
  async isPresent(stub, args) {
    Validations.checkLength(args, 1);
    Validations.checkLength(args[0], 64);
    const donationId = args[0];
    const donationData = await stub.getState(donationId);
    const response = { exists: !Helpers.isEmpty(donationData) };
    return Helpers.jsonToBuffer(response);
  }

  /**
   * get history of a given donation ID
   *
   * @async
   * @function getHistoryForDonation
   * @param {Object} stub - encapsulates the APIs between the chaincode implementation and the Fabric peer
   * @param {Array} args - contains donation ID to query
   * @throws Will throw if number of input arguments is not one
   * @throws Will throw if if argument length is not 64
   * @returns {ArrayBuffer} Array of state update details for a given donation ID
   */
  async getHistoryForDonation(stub, args) {
    Validations.checkLength(args, 1);
    Validations.checkLength(args[0], 64);
    const donationId = args[0];
    console.info("Get history for Donation ID: %s\n", donationId);

    const resultsIterator = await stub.getHistoryForKey(donationId);
    const results = await Helpers.getAllResults(resultsIterator, true);

    return Helpers.jsonToBuffer(results);
  }

  /**
   * AddDonation function representing creation of a donation
   * Storing it against a unique transaction ID
   *
   * @async
   * @function addDonation
   * @param {Object} stub - encapsulates the APIs between the chaincode implementation and the Fabric peer
   * @param {Array} donationData - contains project, itemType, amount in the same order
   * @throws Will throw if number of input arguments is not three
   * @returns {Buffer} Object containing the donation ID created
   */
  async addDonation(stub, donationData) {
    Validations.checkLength(donationData, 3);
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
      return Helpers.jsonToBuffer(result);
    } catch (error) {
      throw new Error(
        `Failed to create state for Donation ID: ${donationId}. Received ${error}`
      );
    }
  }

  /**
   * Update function representing update of a donation using Donation ID
   *
   * @async
   * @function updateDonation
   * @param {Object} stub - encapsulates the APIs between the chaincode implementation and the Fabric peer
   * @param {Array} updatedDonationData - contains project, itemType, amount tags as well as the updated values. First all required tags are mentioned and then values are mentioned
   * @throws Will throw if number of input arguments is not between 3 and 7
   * @throws Will throw if if first argument length is not 64
   * @throws Will throw if stae retrived for given donationID is empty
   * @returns {Buffer} Object containing the donation ID updated and the transaction ID
   */
  async updateDonation(stub, updatedDonationData) {
    const donationId = updatedDonationData[0];
    Validations.checkLength(donationId, 64);
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
      return Helpers.jsonToBuffer(result);
    } catch (error) {
      throw new Error(
        `Failed to update state for Donation ID: ${donationId}. Received ${error}`
      );
    }
  }

  /**
   * Deletes a donation entity from state store
   *
   * @async
   * @function removeDonation
   * @param {Object} stub - encapsulates the APIs between the chaincode implementation and the Fabric peer
   * @param {Array} donationData - contains donation ID to be removed
   * @throws Will throw if number of input arguments is not one
   * @throws Will throw if if first argument length is not 64
   * @throws Will throw if stae retrived for given donationID is empty
   * @returns {Buffer} Object containing the donation ID removed and the transaction ID
   */
  async removeDonation(stub, donationData) {
    Validations.checkLength(donationData, 1);
    Validations.checkLength(donationData[0], 64);
    const donationId = donationData[0];

    try {
      const fetchedState = await stub.getState(donationId);
      Validations.throwIfEmpty(fetchedState);

      // Delete the key from the state in ledger
      await stub.deleteState(donationId);

      const result = { donationId, deleteTx: await stub.getTxID() };
      return Helpers.jsonToBuffer(result);
    } catch (error) {
      throw new Error(
        `Failed to delete state for Donation ID: ${donationId}. Received ${error}`
      );
    }
  }
}

// shim.start(new DonationManager());
module.exports = DonationManager;