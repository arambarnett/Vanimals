const { MongoMemoryReplSet } = require("mongodb-memory-server");
const LocalCache = require("node-cache");
const Database = require("core-tv-database");
const Logger = require("./logger");

module.exports = async() => {
  const cache = new LocalCache({ stdTTL: 3600 });
  const logger = Logger();
  const replSet = new MongoMemoryReplSet({
    replSet: { storageEngine: "wiredTiger" },
  });
  
  await replSet.waitUntilRunning();

  const CONNECTION_URI = await replSet.getUri();
  
  const database = await Database({
    config: { DB: { CONNECTION_URI, MAX_POOL_SIZE: 5, MIN_POOL_SIZE: 1 } },
    cache,
    logger
  });

  return database;
};
