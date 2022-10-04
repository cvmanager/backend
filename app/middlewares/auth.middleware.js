import jsonwebtoken from 'jsonwebtoken';

import BadRequestError from '../exceptions/BadRequestError.js'
import redisClient from '../helper/redis_client.js'

async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            throw new BadRequestError('auth.err.token_not_sended');
        }
        let token = req.headers.authorization.split(' ')[1];
        let payload = await jsonwebtoken.verify(token, process.env.JWT_SECRET_TOKEN);
        req.user_id = payload.sub;
        next();
    } catch (err) {
        next(err);
    }
}

async function verifyRefrshToken(req, res, next) {
    try {
        const token = req.body.token;
        if (token === null) throw new BadRequestError('auth.err.token_not_sended');

        let payload = await jsonwebtoken.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN);
        req.user_id = payload.sub;




            await redisClient.get(payload.sub.toString(), (err, data) => {
                if (err) throw new Error(err);
                if (data == null) throw new BadRequestError('auth.err.token_not_stored');
    
                if (JSON.parse(data).token != token) throw new BadRequestError('auth.err.token_not_same');
    
            });

        next();
    } catch (err) {
        next(err);
    }
}

export { verifyToken, verifyRefrshToken }