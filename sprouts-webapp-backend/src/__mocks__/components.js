const Crypto = require("crypto");
const Ticketer = require("../lib/ticketer");
const Cypher = require("../lib/cypher");
const Database = require("./database");

const config = {
  TICKETS_ENCRYPTION_SECRET: Crypto.randomBytes(16).toString("hex"),
  SHOW_EXTRA_SECONDS_TO_ANSWER: 3,
  SHOWS_JOINABLE_BEFORE_MINUTES: 5,
  IS_TESTING: true
};

module.exports = async() => {
  const cypher = Cypher(config.TICKETS_ENCRYPTION_SECRET);
  const ticketer = Ticketer({ cypher });
  const database = await Database();

  return {
    database,
    config,
    cypher,
    ticketer,
  };
};
