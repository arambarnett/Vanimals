const Redis = require("redis");

module.exports = ({
  config: { REDIS: { CACHE_HOST, CACHE_PORT } },
}) => new Promise((res, rej) => {
  const _redis = Redis.createClient({
    port: CACHE_PORT,
    host: CACHE_HOST,
  });
  _redis.on("error", rej);
  _redis.on("ready", () => res(_redis));
});
