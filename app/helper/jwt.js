const JWT = require('jsonwebtoken');
const redis_client = require('../helper/redis_client')

function generateJwtToken(data) {
    return JWT.sign({ sub: data, }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: process.env.JWT_EXPIRATION_TIME_TOKEN
    });
}


async function generateJwtRefeshToken(user_id) {
    const refresh_token = await JWT.sign({ sub: user_id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
        expiresIn: process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN
    });

    await redis_client.get(user_id.toString(), (err, data) => {
        if (err) throw new Error(err);
    });
    await redis_client.set(user_id.toString(), JSON.stringify({ token: refresh_token }))

    return refresh_token;
}
module.exports = { generateJwtToken, generateJwtRefeshToken }