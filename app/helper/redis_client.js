import redis from 'redis';
import env from './env.js';

let redisClient;
const salam = async () => {
     redisClient = redis.createClient({
        socket: {
            host: env('REDIS_HOST'),
            port: env('REDIS_PORT'),
        },
    });

    redisClient.on("error", (err) => {
        console.log(err)
    })
    await redisClient.connect();
}
salam();

export default redisClient