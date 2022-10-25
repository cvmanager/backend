import redis from 'redis';
import env from './env.js';


const redisClient = redis.createClient({
    socket: {
        host: env('REDIS_HOST'),
        port: env('REDIS_PORT'),
    },
});

redisClient.on("error", (err) => {
    throw new Error(err)
})
await redisClient.connect();

export default redisClient