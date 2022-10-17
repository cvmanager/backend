import bcrypt from 'bcrypt'

import { generateJwtToken, generateJwtRefeshToken } from '../../helper/jwt.js'
import UserNotFoundError from '../../exceptions/UserNotFoundError.js';
import BadRequestError from '../../exceptions/BadRequestError.js';
import redisClient from '../../helper/redis_client.js';
import AppResponse from '../../helper/response.js';
import User from '../../models/user.model.js';
import Controller from './controller.js';

class AuthController extends Controller {

    async login(req, res, next) {
        try {
            let user = await User.findOne({ mobile: req.body.mobile, deleted_at: null });
            if (!user) throw new UserNotFoundError();


            let validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) throw new BadRequestError('auth.error.invalid_credentials');

            if (user.is_banded) throw new BadRequestError('auth.error.user_is_banned');


            const access_token = await generateJwtToken(user._id)
            const refresh_token = await generateJwtRefeshToken(user._id);

            AppResponse.builder(res).message('auth.message.success_login').data({ access_token, refresh_token }).send();
        } catch (err) {
            next(err);
        }
    }

    async signup(req, res, next) {
        try {

            let user = await User.findOne({ mobile: req.body.mobile });
            if (user) {
                throw new BadRequestError('auth.error.user_already_exists');
            }
            let salt = await bcrypt.genSalt(10);
            let hash_password = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                mobile: req.body.mobile,
                password: hash_password,
            });

            const access_token = await generateJwtToken(user._id)
            const refresh_token = await generateJwtRefeshToken(user._id);

            AppResponse.builder(res).status(201).message("auth.message.user_successfuly_created").data({ access_token, refresh_token }).send();
        } catch (err) {
            next(err);
        }
    }

    async refresh(req, res, next) {
        try {
            const access_token = await generateJwtToken(req.user_id)
            const refresh_token = await generateJwtRefeshToken(req.user_id);
            AppResponse.builder(res).message('auth.message.success_login').data({ access_token, refresh_token }).send();
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            await redisClient.del(req.user_id.toString());
            AppResponse.builder(res).message("auth.message.success_logout").send();
        } catch (err) {
            next(err);
        }
    }

    async verifyToken(req, res, next) {
        AppResponse.builder(res).message("auth.message.token_verified").send();
    }
}


export default new AuthController;