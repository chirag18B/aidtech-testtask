const { isDivisibleByTwo } = require("./validations");

const Helpers = class {
  static toBuffer(value) {
    return Buffer.from(JSON.stringify(value));
  }

  static bufferToJSON(buffer) {
    try {
      const response =
        buffer.toString() === "undefined"
          ? null
          : JSON.parse(buffer.toString());
      return response;
    } catch (error) {
      throw new Error(`Error parsing value to JSON: ${buffer.toString()}.`);
    }
  }

  static isEmpty(value) {
    return value.toString() === "" ? true : false;
  }

  static defaultToUndefinedIfEmpty(value) {
    if (value.toString() === "") {
      console.info("Defaulting to undefined.");

      return Buffer.from("undefined");
    }
    return value;
  }

  static formatToJson(args) {
    let obj = {
      project: args[0],
      itemType: args[1],
      amount: parseFloat(args[2]),
      timestamp: args[3],
      validity: args[4]
    };

    return obj;
  }

  static jsonToBuffer(obj) {
    return Buffer.from(JSON.stringify(obj));
  }

  static createUpdateJson(array) {
    return new Promise(function(resolve, reject) {
      try {
        isDivisibleByTwo(array.length);
        const keys = array.slice(0, array.length / 2);
        const values = array.slice(array.length / 2);

        let counter = 0;
        let formattedObj = {};
        while (counter < keys.length) {
          formattedObj[keys[counter]] = values[counter];
          counter++;

          if (counter === keys.length) resolve(formattedObj);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  static async getAllResults(iterator, isHistory) {
    console.info(`Entered _getAllResults query with isHistory: ${isHistory}`);
    let allResults = [];
    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.info(res.value.value.toString("utf8"));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.error(err);
            jsonRes.Value = res.value.value.toString("utf8");
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.error(err);
            jsonRes.Record = res.value.value.toString("utf8");
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.info("End of data for _getAllResults query");
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }
};

module.exports = Helpers;
