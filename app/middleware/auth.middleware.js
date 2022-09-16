const JWT = require('jsonwebtoken');
const BadRequestError = require('../exceptions/BadRequestError');
const redis_client = require('../helper/redis_client');
async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            throw new BadRequestError('token not sended!');
        }
        let token = req.headers.authorization.split(' ')[1];
        let payload = await JWT.verify(token, process.env.JWT_SECRET_TOKEN);
        req.user_id = payload.sub;
        next();
    } catch (err) {
        next(err);
    }
}

async function verifyRefrshToken(req, res, next) {
    try {
        const token = req.body.token;
        if (token === null) throw new BadRequestError('token not sended!');

        let payload = await JWT.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN);
        req.user_id = payload.sub;


        await redis_client.get(payload.sub.toString())
            .then((data) => {

                if (data == null) throw new BadRequestError('Token is not in store.');
                if (JSON.parse(data).token != token) throw new BadRequestError('Token is not same store.');
            });

        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { verifyToken, verifyRefrshToken }