const JWT = require('jsonwebtoken');

function generateJwtToken(data) {
    return JWT.sign({ sub: data, }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: process.env.JWT_EXPIRATION_TIME_TOKEN
    });
}


async function generateJwtRefeshToken(data) {
    return await JWT.sign({ sub: data }, process.env.JWT_SECRET_REFRESH_TOKEN, {
        expiresIn: process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN
    });
}

module.exports = { generateJwtToken, generateJwtRefeshToken }