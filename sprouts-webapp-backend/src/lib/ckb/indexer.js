const axios = require("axios");

const getIndexerInfo = async (indexerUrl) => {
  const post_data = {
    id: Date.now(),
    jsonrpc: "2.0",
    method: "get_indexer_info",
    params: [],
  };

  const post_options = {
    headers: {
      "Content-Type": "application/json",
    }
  };

  return axios.post(indexerUrl, post_data, post_options)
    .then((response) => (response.data.result));
};

// get the last block known by the indexer
const getIndexerTip = async (indexerUrl) => {
  const post_data = {
    id: Date.now(),
    jsonrpc: "2.0",
    method: "get_tip",
    params: [],
  };

  const post_options = {
    headers: {
      "Content-Type": "application/json",
    }
  };

  return axios.post(indexerUrl, post_data, post_options)
    .then((response) => (response.data.result));
};

module.exports = {
  getIndexerInfo,
  getIndexerTip
};
