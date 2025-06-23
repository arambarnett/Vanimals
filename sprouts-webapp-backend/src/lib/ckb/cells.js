
const axios = require("axios").default;

// this module can be merged with indexer module

// Use a config file to avoid passing indexerUrl everywere

// use constant to set default limit

// last_cursor is like offset, should came from the result of a previous call, dont try to parse an int!!
// order can be, "asc" or "desc"
const getLiveCellsByLock = async ({ indexerUrl, lockScript, limit = 100, last_cursor = null, order = "asc" }) => {

  const post_data = {
    id: Date.now(),
    jsonrpc: "2.0",
    method: "get_cells",
    params: [
      {
        script: {
          code_hash: lockScript.codeHash,
          hash_type: lockScript.hashType,
          args: lockScript.args
        },
        script_type: "lock"
      },
      order,
      "0x" + limit.toString(16),
      last_cursor
    ],
  };

  const post_options = {
    headers: {
      "Content-Type": "application/json",
    }
  };

  return axios.post(indexerUrl, post_data, post_options)
    .then((response) => {
      if (response.data.error) throw Error(response.data.error.message);
      // parse to return cells data structure compatible with ckb-sdk
      const last_cursor = response.data.result.last_cursor;
      const cells = response.data.result.objects.map((value) => ({
        lock: {
          codeHash: value.output.lock.code_hash,
          hashType: value.output.lock.hash_type,
          args: value.output.lock.args,
        },
        type: value.output.type ? {
          codeHash: value.output.type.code_hash,
          hashType: value.output.type.hash_type,
          args: value.output.type.args,
        } : null,
        outPoint: {
          txHash: value.out_point.tx_hash,
          index: value.out_point.index,
        },
        capacity: value.output.capacity,
        data: value.output_data,
      }));
      return ({ cells, last_cursor });
    });
};

// get balance from indexer
const getBalanceByLock = async (indexerUrl, lockScript) => {
  const post_data = {
    id: Date.now(),
    jsonrpc: "2.0",
    method: "get_cells_capacity",
    params: [
      {
        script: {
          code_hash: lockScript.codeHash,
          hash_type: lockScript.hashType,
          args: lockScript.args
        },
        script_type: "lock"
      },
    ],
  };

  const post_options = {
    headers: {
      "Content-Type": "application/json",
    }
  };

  return axios.post(indexerUrl, post_data, post_options)
    .then((response) => {
      // parse to return only cells data structure
      const balance = BigInt(response.data.result.capacity);
      return (balance);
    });
};

// last_cursor is like offset, should came from the result of a previous call, dont try to parse an int!!
// order can be, "asc" or "desc"
const getAllTransactionsByLock = async ({ indexerUrl, lockScript, limit = 100, last_cursor = null, order = "asc" }) => {

  const post_data = {
    id: Date.now(),
    jsonrpc: "2.0",
    method: "get_transactions",
    params: [
      {
        script: {
          code_hash: lockScript.codeHash,
          hash_type: lockScript.hashType,
          args: lockScript.args
        },
        script_type: "lock"
      },
      order,
      "0x" + limit.toString(16),
      last_cursor
    ],
  };

  const post_options = {
    headers: {
      "Content-Type": "application/json",
    }
  };

  return axios.post(indexerUrl, post_data, post_options)
    .then((response) => {
      if (response.data.error) throw Error(response.data.error.message);
      const last_cursor = response.data.result.last_cursor;
      const transactions = response.data.result.objects;
      return ({ transactions, last_cursor });
    });
};

module.exports = {
  getLiveCellsByLock,
  getBalanceByLock,
  getAllTransactionsByLock,
};
