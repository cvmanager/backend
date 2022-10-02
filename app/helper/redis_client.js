import redis from 'redis';

const redisClient = redis.createClient(
    {
        url: process.env.REDIS_URL,
        legacyMode: true,
    }
);

redisClient.on("error", (err) => console.log("Error " + err))
redisClient.connect();

export default redisClient

