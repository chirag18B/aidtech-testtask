const Validations = class {
  static checkArgsLength(args, expectedLength) {
    if (args.length !== expectedLength) {
      _throw(
        `Invalid number of arguments. Expected ${expectedLength}, got ${
          args.length
        } in args: ${args}.`
      );
    }
  }

  static checkArgsLengthIsWithinRange(args, lowerLimit, upperLimit) {
    if (args.length < lowerLimit || args.length > upperLimit) {
      _throw(
        `Invalid number of arguments. Expected length between ${lowerLimit}-${upperLimit}, 
          got ${args.length} in args: ${args}.`
      );
    }
  }

  static equalsLength(arg, size) {
    if (arg.length !== size) {
      _throw(
        `Invalid argument length. Expected string of length: ${size}, got: ${arg}.`
      );
    }
  }

  static isArray(arg) {
    if (!Array.isArray(arg)) {
      _throw(
        `Invalid argument type. Expected array, got ${typeof arg} ${arg}.`
      );
    }
  }

  static checkSuccessfulStateRetrieval(donationData) {
    if (!donationData) {
      _throw(`Failed to get state.`);
    }
  }

  static throwIfEmpty(donationData) {
    if (_isEmpty(donationData)) {
      _throw(`Donation data is absent OR no state registered.`);
    }
  }

  static isDivisibleByTwo(number) {
    if (number % 2 !== 0) {
      _throw(`Number of elements in update request should be even`);
    }
  }

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

  static checkDonationArgsType(args) {
    const [project, itemType, amount] = args;
    const validity =
      this.isValidProject(project) &&
      this.isValidItemType(itemType) &&
      this.isValidAmount(amount);
    return validity;
  }
};

const _isEmpty = value => {
  return value.toString() === "" ? true : false;
};

const _throw = msg => {
  throw new Error(msg);
};

module.exports = Validations;
