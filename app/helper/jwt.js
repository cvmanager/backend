const JWT = require('jsonwebtoken');
const BadRequestError = require('../middleware/BadRequestError')
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

async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            throw new BadRequestError('token not sended!');
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token);
        let payload = await JWT.verify(token, process.env.JWT_SECRET_TOKEN);
        req.user_id = payload.sub;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { generateJwtToken, generateJwtRefeshToken, verifyToken }