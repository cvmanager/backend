import jsonwebtoken from 'jsonwebtoken';

import redisClient from '../helper/redis_client.js'
import env from './env.js';

async function generateJwtToken(data) {
    return jsonwebtoken.sign({ sub: data, }, env("JWT_SECRET_TOKEN"), {
        expiresIn: env("JWT_EXPIRATION_TIME_TOKEN")
    });
}


async function generateJwtRefreshToken(user_id) {
    const refresh_token = await jsonwebtoken.sign(
        { sub: user_id }, 
        env("JWT_SECRET_REFRESH_TOKEN"), 
        { expiresIn: env("JWT_EXPIRATION_TIME_REFRESH_TOKEN") }
    );

    await redisClient.sAdd(user_id.toString() + env("REDIS_KEY_REF_TOKENS"), refresh_token)

    return refresh_token;
}

export { generateJwtToken, generateJwtRefreshToken }