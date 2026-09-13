const { Redis } = require("ioredis");
const env = require("./env");

const connection = new Redis({
  host: env.redis.host,
  port: env.redis.port,
  maxRetriesPerRequest: null,
});

module.exports = connection;
