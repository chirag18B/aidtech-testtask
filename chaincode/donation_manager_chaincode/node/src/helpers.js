const { isDivisibleByTwo } = require("./validations");
const { INDEX } = require("./constants");

/**
 * Helper: convert JSON to Buffer
 *
 * @function jsonToBuffer
 */
function jsonToBuffer(value) {
  return Buffer.from(JSON.stringify(value));
}

/**
 * Helper: convert Buffer to JSON
 *
 * @function bufferToJSON
 */
function bufferToJSON(buffer) {
  try {
    const response =
      buffer.toString() === "undefined" ? null : JSON.parse(buffer.toString());
    return response;
  } catch (error) {
    throw new Error(`Error parsing value to JSON: ${buffer.toString()}.`);
  }
}

/**
 * Helper: check if value is empty
 *
 * @function isEmpty
 */
function isEmpty(value) {
  return value.toString() === "" ? true : false;
}

/**
 * Helper: default to undefined if empty
 *
 * @function defaultToUndefinedIfEmpty
 */
function defaultToUndefinedIfEmpty(value) {
  if (value.toString() === "") {
    console.info("Defaulting to undefined.");

    return Buffer.from("undefined");
  }
  return value;
}

/**
 * Helper: format array to JSON donation object
 *
 * @function formatToJson
 */
function formatToJson(args) {
  let obj = {
    project: args[INDEX.project],
    itemType: args[INDEX.itemType],
    amount: parseFloat(args[INDEX.amount]),
    timestamp: args[INDEX.timestamp],
    validity: args[INDEX.validity]
  };

  return obj;
}

/**
 * Helper: create a JSON donation object for state update functions
 *
 * @function createUpdateJson
 */
function createUpdateJson(array) {
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

/**
 * Helper: get results for a query using an iterator
 *
 * @async
 * @function getAllResults
 */
async function getAllResults(iterator, isHistory) {
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

function objCompare(obj1, obj2) {
  // Loop through properties in object 1
  for (const p in obj1) {
    // Check property exists on both objects
    if (obj1.hasOwnProperty(p) != obj2.hasOwnProperty(p)) return false;

    switch (typeof (obj1[p])) {
      // Deep compare objects
      case 'object':
        if (!objCompare(obj1[p], obj2[p])) return false;
        break;
      // Compare function code
      case 'function':
        if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
        break;
      // Compare values
      default:
        if (obj1[p] != obj2[p]) return false;
    }
  }

  // Check object 2 for any extra properties
  for (const p in obj2) {
    if (typeof (obj1[p]) == 'undefined') return false;
  }
  return true;
}


module.exports = {
  jsonToBuffer,
  createUpdateJson,
  formatToJson,
  defaultToUndefinedIfEmpty,
  getAllResults,
  isEmpty,
  bufferToJSON,
  objCompare
};
