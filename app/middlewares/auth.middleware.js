import jsonwebtoken from 'jsonwebtoken';

import BadRequestError from '../exceptions/BadRequestError.js'
import UnauthorizedError from '../exceptions/UnauthorizedError.js'
import redisClient from '../helper/redis_client.js'
import env from '../helper/env.js';
import userService from '../helper/service/user.service.js';

async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            throw new BadRequestError('auth.errors.token_not_sended');
        }
        let token = req.headers.authorization.split(' ')[1];
        let payload = await jsonwebtoken.verify(token, env('JWT_SECRET_TOKEN'));
        req.user = await userService.findById(payload.sub._id);

        next();
    } catch (err) {
        next(err);
    }
}

async function verifyRefreshToken(req, res, next) {
    try {
        const token = req.body.token;
        if (token === null) throw new BadRequestError('auth.errors.token_not_sended');

        let payload = await jsonwebtoken.verify(token, env('JWT_SECRET_REFRESH_TOKEN'));
        req.user = await userService.findById(payload.sub._id);

        const redisKey = payload.sub.toString() + env("REDIS_KEY_REF_TOKENS")
        const tokenExist = await redisClient.sIsMember(redisKey, token)

        if (!tokenExist) throw new BadRequestError('auth.errors.token_not_stored');

        next();
    } catch (err) {
        next(err);
    }
}

async function checkVerifiedMobile(req, res, next) {
    try {
        if (!req.user.mobile_verified_at) throw new UnauthorizedError("user.errors.mobile_not_veryfied");
        next();
    } catch (err) {
        next(err);
    }
}

export { verifyToken, verifyRefreshToken , checkVerifiedMobile }
