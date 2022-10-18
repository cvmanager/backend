import bcrypt from 'bcrypt'

import { generateJwtToken, generateJwtRefeshToken } from '../../helper/jwt.js'
import UserNotFoundError from '../../exceptions/UserNotFoundError.js';
import BadRequestError from '../../exceptions/BadRequestError.js';
import redisClient from '../../helper/redis_client.js';
import AppResponse from '../../helper/response.js';
import User from '../../models/user.model.js';
import Controller from './controller.js';
import env from '../../helper/env.js';

class AuthController extends Controller {

    /**
     * POST /auth/login
     * 
     * @summary Authenticate and receive login token
     * @tags Auth
     * 
     * @param  { auth.login } request.body - login info - application/json
     * 
     * @return { auth.user_notfound } 400 - user not found or user is banned or user name or password incorrect
     * @return { message.server_error  }  500 - Server Error
     */
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

    /**
     * POST /auth/signup
     * 
     * @summary Join the site and receive an authentication token
     * @tags Auth 
     *
     * @param { auth.signup } request.body - signup info - application/json
     * 
     * @return { auth.success_signup }  201 - signup successfuly 
     * @return { message.badrequest_error }     400 - Bad Request
     * @return { message.server_error  }    500 - Server Error
     */
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


    /**
     * POST /auth/refresh
     * 
     * @summary Updating the authentication token and receiving a new token
     * @tags Auth 
     *
     * @param { auth.refresh } request.body - refresh info - application/json
     * 
     * @return { auth.success_signup }  200 - refresh successfuly 
     * @return { message.badrequest_error }     400 - Bad Request
     * @return { message.server_error  }    500 - Server Error
     */
    async refresh(req, res, next) {
        try {
            const access_token = await generateJwtToken(req.user_id)
            const refresh_token = await generateJwtRefeshToken(req.user_id);

            const redisKey = req.user_id.toString() + env("REDIS_KEY_REF_TOKENS")
            redisClient.sRem(redisKey, req.body.token)

            AppResponse.builder(res).message('auth.message.success_login').data({ access_token, refresh_token }).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /auth/logout
     * 
     * @summary Sign out of the user account and delete the authentication token
     * @tags Auth 
     * @security BearerAuth
     *
     * @param { auth.refresh } request.body - refresh info - application/json
     * 
     * @return { auth.success_signup }  200 - logout successfuly 
     * @return { message.badrequest_error }     400 - Bad Request
     * @return { message.server_error  }    500 - Server Error
     */
    async logout(req, res, next) {
        try {
            const token = req.body.token;
            if (token === null) throw new BadRequestError('auth.error.token_not_sended');

            const redisKey = req.user_id.toString() + env("REDIS_KEY_REF_TOKENS")
            await redisClient.sRem(redisKey, token);

            AppResponse.builder(res).message("auth.message.success_logout").send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /auth/verify-token
     * 
     * @summary Check and confirm user authentication token
     * @tags Auth 
     * @security BearerAuth
     *
     * @param { auth.refresh } request.body - refresh info - application/json
     * 
     * @return { auth.success_signup }  200 - logout successfuly 
     * @return { message.badrequest_error }     401 - UnauthorizedError
     * @return { message.server_error  }    500 - Server Error
     */
    async verifyToken(req, res, next) {
        AppResponse.builder(res).message("auth.message.token_verified").send();
    }
}


export default new AuthController;