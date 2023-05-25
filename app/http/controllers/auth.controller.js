import bcrypt from 'bcrypt'

import { generateJwtToken, generateJwtRefeshToken } from '../../helper/jwt.js'
import BadRequestError from '../../exceptions/BadRequestError.js';
import redisClient from '../../helper/redis_client.js';
import AppResponse from '../../helper/response.js';
import User from '../../models/user.model.js';
import Controller from './controller.js';
import env from '../../helper/env.js';
import EventEmitter from '../../events/emitter.js';
import { UserEvents } from '../../events/subscribers/user.subscriber.js';
import roleService from '../../helper/service/role.service.js';
import userService from '../../helper/service/user.service.js';
import VerificationRequest from '../../models/verificationRequest.model.js';
import Kavenegar from '../../helper/kavenegar.js';

class AuthController extends Controller {

    /**
     * POST /auth/login
     * 
     * @summary Authenticate and receive login token
     * @tags Auth
     * 
     * @param  { auth.login } request.body - login info - application/json
     * 
     * @return { auth.success_response }    200 - signup successfully 
     * @return { auth.user_notfound }       400 - user not found || username or password incorrect
     * @return { message.server_error  }    500 - Server Error
     */
    async login(req, res, next) {
        try {
            let user = await userService.findOne({
                $or: [
                    { mobile: req.body.mobile },
                    { username: req.body.mobile }
                ]
            })

            if (!user) throw new BadRequestError('auth.errors.invalid_credentials');

            let validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) throw new BadRequestError('auth.errors.invalid_credentials');

            if (user.is_banned) throw new BadRequestError('auth.errors.user_is_banned');

            const access_token = await generateJwtToken({ _id: user._id, role: user.role })
            const refresh_token = await generateJwtRefeshToken({ _id: user._id, role: user.role });

            EventEmitter.emit(UserEvents.LOGIN, user, req, access_token, refresh_token);
            AppResponse.builder(res).message('auth.messages.success_login').data({ access_token, refresh_token }).send();
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
    * @return { auth.success_response }        201 - signup successfully 
    * @return { message.badrequest_error }     400 - Bad Request
    * @return { message.server_error  }        500 - Server Error
    */
    async signup(req, res, next) {
        try {
            let user = await User.findOne({ $or: [{ mobile: req.body.mobile }, { username: req.body.username }] });
            if (user) throw new BadRequestError('auth.errors.user_already_exists');

            let salt = await bcrypt.genSalt(10);
            let hash_password = await bcrypt.hash(req.body.password, salt);

            const ownerRole = await roleService.findOne({ name: "Owner" })

            user = await User.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                mobile: req.body.mobile,
                username: req.body.username,
                password: hash_password,
                role: ((ownerRole && ownerRole._id) ? [ownerRole._id] : [])
            });

            const access_token = await generateJwtToken({ _id: user._id, role: [ownerRole._id] })
            const refresh_token = await generateJwtRefeshToken({ _id: user._id, role: [ownerRole._id] });

            EventEmitter.emit(UserEvents.SINGUP, user, req, access_token, refresh_token);
            AppResponse.builder(res).status(201).message("auth.messages.user_successfully_created").data({ access_token, refresh_token }).send();
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
     * @return { auth.success_signup }          200 - refresh successfully 
     * @return { message.badrequest_error }     400 - Bad Request
     * @return { message.server_error  }        500 - Server Error
     */
    async refresh(req, res, next) {
        try {
            const access_token = await generateJwtToken({ _id: req.user._id, role: req.user.role })
            const refresh_token = await generateJwtRefeshToken({ _id: req.user._id, role: req.user.role });

            const redisKey = req.user._id.toString() + env("REDIS_KEY_REF_TOKENS")
            redisClient.sRem(redisKey, req.body.token)

            AppResponse.builder(res).message('auth.messages.success_login').data({ access_token, refresh_token }).send();
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
     * @return { auth.success_signup }          200 - logout successfully 
     * @return { message.badrequest_error }     400 - Bad Request
     * @return { message.server_error  }        500 - Server Error
     */
    async logout(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];

            const redisKey = req.user._id.toString() + env("REDIS_KEY_REF_TOKENS")
            await redisClient.sRem(redisKey, token);

            EventEmitter.emit(UserEvents.LOGOUT, token);
            AppResponse.builder(res).message("auth.messages.success_logout").send();
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
     * @return { auth.success_signup }              200 - logout successfully 
     * @return { message.unauthorized_error }       401 - UnauthorizedError
     * @return { message.server_error  }            500 - Server Error
     */
    async verifyToken(req, res, next) {
        AppResponse.builder(res).message("auth.messages.token_verified").send();
    }

    /**
     * POST /auth/username-isavailable
     * 
     * @summary Check and confirm username
     * @tags Auth 
     *
     * @param { auth.checkUsername }                request.body - refresh info - application/json
     * 
     * @return { auth.success }                     200 - found successfully 
     * @return { message.server_error  }            500 - Server Error
     */
    async checkusername(req, res, next) {
        try {
            let user = await User.findOne({ username: req.body.username });
            if (user) throw new BadRequestError('auth.errors.username_exist');

            AppResponse.builder(res).message("auth.messages.username_is_available").send();
        } catch (err) {
            next(err);
        }
    }


    /**
       * POST /auth/send-verify
       * 
       * @summary create new request for validation mobile number
       * @tags Auth 
       * @security BearerAuth
       *
       * @return { message.badrequest_error }     400 - Bad Request
       * @return { message.server_error  }        500 - Server Error
    */
    async sendMobileVerificationCode(req, res, next) {
        try {
            if (req.user.mobile_verified_at) throw new BadRequestError('auth.errors.authentication_has_already_been_done')

            let log = await VerificationRequest.findOne({ 'user_id': req.user._id, 'veriffication_at': null, $or: [{ expire_at: null }, { expire_at: { $gt: new Date() } }] })
            if (log) throw new BadRequestError('auth.errors.authentication_code_has_already_been_sent')

            let currentTime = new Date();
            let verify_code = Math.floor(Math.random() * 90000 + 10000);

            let sendSmsResult = Kavenegar.builder(req.user).message(`Your authentication code :‌ ${verify_code} \nCV Manager`).receptor(req.user.mobile).send();
            if (!sendSmsResult) new BadRequestError('auth.errors.error_sending_mobile_verification_code')


            await VerificationRequest.create({
                user_id: req.user._id,
                provider: 'sms',
                code: verify_code,
                receiver: req.user.mobile,
                expire_at: new Date(currentTime.getTime() + (env('SMS_EXPIRATION_TIME_IN_MINUTE') * 60 * 1000)),
            });

            AppResponse.builder(res).message('auth.messages.your_mobile_has_been_successfully_verified').send();
        } catch (err) {
            next(err);
        }
    }

    /** 
      * POST /auth/check-verify
      * 
      * @summary check mobile validation request
      * @tags Auth 
      * @security BearerAuth
      * 
      * @param { auth.checkVerify } request.body - refresh info - application/json
      * 
      * @return { message.badrequest_error }     400 - Bad Request
      * @return { message.server_error  }        500 - Server Error
      */
    async checkMobileVerificationCode(req, res, next) {
        try {
            if (req.user.mobile_verified_at) throw new BadRequestError('auth.errors.authentication_has_already_been_done')

            let log = await VerificationRequest.findOne({ 'user_id': req.user._id, 'veriffication_at': null, $or: [{ expire_at: null }, { expire_at: { $gt: new Date() } }] })
            if (!log) throw new BadRequestError('auth.errors.valid_authentication_code_was_not_found_for_you')

            if (req.body.verify_code != log.code) {
                log.attempts = log.attempts + 1;
                await log.save();
                throw new BadRequestError('auth.errors.authentication_code_sent_is_invalid')
            }

            log.veriffication_at = new Date();
            await log.save();
            EventEmitter.emit(UserEvents.MOBILDE_VERIFICATION, req.user, req);
            AppResponse.builder(res).message('auth.messages.authentication_code_sent_successfully').send();
        } catch (err) {
            next(err);
        }
    }

    /**     
     * GET /auth/get-me
     * @summary Get authenticated user information
     * @tags Auth
     * @security BearerAuth
     * 
     * @return { user.success }             200 - user successfully found
     * @return { message.badrequest_error } 400 - user not found
     * @return { message.badrequest_error } 401 - UnauthorizedError
     * @return { message.server_error}      500 - Server Error
     */
    async getMe(req, res, next) {
        try {
            let user = await userService.findOne(req.user._id, [
                { path: 'role', select: ['name', 'id', 'permissions'] },
                { path: "fcmtokens", select: ['token'] }
            ])
            if (!user) throw new NotFoundError('user.errors.user_notfound');
            await user.populate({
                path: "role.permissions"
            })

            AppResponse.builder(res).data(user).message('user.messages.user_founded').send();
        } catch (err) {
            next(err);
        }
    }
}


export default new AuthController;