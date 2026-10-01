const Redis = require("ioredis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis (redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 200, 2000)
});

redis.on("connect", () => {console.log("redis is connected")});

redis.on("error", (err) => {console.error("redis error: ", err.message)});

redis.connect().catch((err) => {console.error("redis initial connection failed: ", err.message)});

module.exports = redis;