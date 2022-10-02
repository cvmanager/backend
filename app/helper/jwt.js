import jsonwebtoken from 'jsonwebtoken';
import redisClient from '../helper/redis_client.js'

async function generateJwtToken(data) {
    return await jsonwebtoken.sign({ sub: data, }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: process.env.JWT_EXPIRATION_TIME_TOKEN
    });
}


async function generateJwtRefeshToken(user_id) {
    const refresh_token = await jsonwebtoken.sign({ sub: user_id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
        expiresIn: process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN
    });

    await redisClient.get(user_id.toString(), (err, data) => {
        if (err) throw new Error(err);
    });
    await redisClient.set(user_id.toString(), JSON.stringify({ token: refresh_token }))

    return refresh_token;
}


export { generateJwtToken, generateJwtRefeshToken }