/**
 * No instance required, all functions static
 *
 * @class
 */
const Validations = class {
  /**
   * Validation: to check length of the argument matches expected length
   *
   * @function checkLength
   */
  static checkLength(args, expectedLength) {
    if (args.length !== expectedLength) {
      _throw(
        `Invalid number of arguments. Expected ${expectedLength}, got ${
          args.length
        } in args: ${args}.`
      );
    }
  }

  /**
   * Validation: to check length of the argument is within a given range
   *
   * @function checkArgsLengthIsWithinRange
   */
  static checkArgsLengthIsWithinRange(args, lowerLimit, upperLimit) {
    if (args.length < lowerLimit || args.length > upperLimit) {
      _throw(
        `Invalid number of arguments. Expected length between ${lowerLimit}-${upperLimit}, 
          got ${args.length} in args: ${args}.`
      );
    }
  }

  /**
   * Validation: check argument is an array
   *
   * @function isArray
   */
  static isArray(arg) {
    if (!Array.isArray(arg)) {
      _throw(
        `Invalid argument type. Expected array, got ${typeof arg} ${arg}.`
      );
    }
  }

  /**
   * Validation: check state retrieval from state store was successful
   *
   * @function checkSuccessfulStateRetrieval
   */
  static checkSuccessfulStateRetrieval(donationData) {
    if (!donationData) {
      _throw(`Failed to get state.`);
    }
  }

  /**
   * Validation: check if data is empty and throw
   *
   * @function throwIfEmpty
   */
  static throwIfEmpty(donationData) {
    if (_isEmpty(donationData)) {
      _throw(`Donation data is absent OR no state registered.`);
    }
  }

  /**
   * Validation: check if number is deivisible by two
   *
   * @function isDivisibleByTwo
   */
  static isDivisibleByTwo(number) {
    if (number % 2 !== 0) {
      _throw(`Number of elements in update request should be even`);
    }
  }

  /**
   * Validation: check if given project is valid
   *
   * @function isValidProject
   */
  static isValidProject(givenProject) {
    const projects = ["FAO", "ILO", "IMO", "ITU", "WHO"];
    const result = projects.includes(givenProject);
    if (!result) {
      console.info(
        `Given project: ${givenProject}, is not valid.`,
        `Valid Projects: ${projects}`
      );
    }
    return result;
  }

  /**
   * Validation: check if given item type is valid
   *
   * @function isValidItemType
   */
  static isValidItemType(givenItemType) {
    const itemTypes = [
      "water",
      "clothes",
      "grains",
      "money",
      "toys",
      "medicine",
      "tents",
      "packed food",
      "flashlight",
      "matchbox",
      "lantern"
    ];
    const result = itemTypes.includes(givenItemType);
    if (!result) {
      console.info(
        `Given itemType: ${givenItemType}, is not valid.`,
        `Valid itemTypes: ${itemTypes}`
      );
    }
    return result;
  }

  /**
   * Validation: check if given amount is valid
   *
   * @function isValidAmount
   */
  static isValidAmount(givenAmount) {
    const result = !isNaN(givenAmount);
    if (!result) {
      console.info(
        `Given amount: ${givenamount}, is not valid.`,
        `It should be a number`
      );
    }
    return result;
  }

  /**
   * Validation: check arguments of a donation object
   *
   * @function checkDonationArgsType
   */
  static checkDonationArgsType(args) {
    const [project, itemType, amount] = args;
    const validity =
      this.isValidProject(project) &&
      this.isValidItemType(itemType) &&
      this.isValidAmount(amount);
    return validity;
  }
};

/**
 * check if empty string
 *
 * @function _isEmpty
 */
const _isEmpty = value => {
  return value.toString() === "" ? true : false;
};

/**
 * throws with the given message when called
 *
 * @function _throw
 */
const _throw = msg => {
  throw new Error(msg);
};

module.exports = Validations;
