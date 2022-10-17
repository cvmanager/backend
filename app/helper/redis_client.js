import redis from 'redis';

const redisClient = redis.createClient(
    {
        url: process.env.REDIS_URL,
        legacyMode: true,
    }
);

redisClient.on("error", (err) => {
    throw new Error(err)
})
await redisClient.connect();

export default redisClient

