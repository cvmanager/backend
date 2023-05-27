import EventEmitter from '../../events/emitter.js';
import BadRequestError from '../../exceptions/BadRequestError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import AppResponse from '../../helper/response.js';
import User from '../../models/user.model.js';
import Company from '../../models/company.model.js';
import loginHistory from '../../models/loginHistory.model.js';
import Controller from './controller.js';
import { UserEvents } from '../../events/subscribers/user.subscriber.js';
import { mergeQuery } from '../../helper/mergeQuery.js';
import userService from '../../helper/service/user.service.js';
import fcmTokenService from '../../helper/service/fcmtoken.service.js';
import FCMToken from '../../models/fcmToken.model.js';
import systemInfo from "systeminformation";

class UserController extends Controller {

    /**
     * GET /users
     * 
     * @summary get list of all users
     * @tags User
     * @security BearerAuth
     * 
     * @return { user.success }             200 - get list of all users
     * @return { message.unauthorized_error }     401 - Unauthorized
     * @return { message.server_error  }    500 - Server Error
     */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query
            let searchQuery = {}
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { firstname: { '$regex': new RegExp(query, "i") } },
                        { lastname: { '$regex': new RegExp(query, "i") } }
                    ]
                }
            }
            const users = await User.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [
                    { path: "fcmtokens", select: ['token'] }
                ]
            });
            AppResponse.builder(res).message("user.messages.list_found").data(users).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /users/{id}
     * @summary get special user by id
     * @tags User
     * @security BearerAuth
     * 
     * @param {string} id.path.required user id
     * 
     * @return { user.success }              200 - find user data
     * @return { message.bad_request_error }      400 - user not found
     * @return { message.bad_request_error }      401 - Unauthorized
     * @return { message.server_error}      500 - Server Error
     */
    async find(req, res, next) {
        try {
            let user = await User.findById(req.params.id).populate([
                { path: "fcmtokens", select: ['token'] }
            ]);
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            AppResponse.builder(res).message("user.messages.user_founded").data(user).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * PATCH /users/{id}/avatar
     * @summary update user profile image
     * @tags User
     * @security BearerAuth
     * 
     * @param { string } id.path.required - user id - application/json
     * @param { user.avatar } request.body - user avatar - multipart/form-data
     * 
     * @return { user.success }              200 - update user profile
     * @return { message.bad_request_error }      400 - user not found
     * @return { message.bad_request_error }      401 - Unauthorized
     * @return { message.server_error}      500 - Server Error
     */
    async uploadProfileImage(req, res, next) {

        try {
            let user = await User.findById(req.params.id);
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            user = await User.findOneAndUpdate({ _id: user._id }, { avatar: req.body.avatar }, { new: true });
            AppResponse.builder(res).message("user.messages.profile_image_successfully_updated").data(user).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /users/{id}/ban
     * @summary ban user
     * @tags User
     * @security BearerAuth
     * 
     * @param { string } id.path.required - user id - application/json
     * 
     * @return { user.success }             200 - user successfully banded
     * @return { message.bad_request_error }      400 - user not found
     * @return { message.bad_request_error }      401 - Unauthorized
     * @return { message.server_error}      500 - Server Error
     */
    async banned(req, res, next) {
        try {
            let user = await User.findById(req.params.id);
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            if (user.is_banned) throw new BadRequestError('user.errors.user_is_currently_blocked')

            user.is_banned = 1;
            user.banned_by = req.user._id;
            user.banned_at = new Date().toISOString();
            await user.save();

            EventEmitter.emit(UserEvents.BANNED, user, req)
            AppResponse.builder(res).message('user.messages.user_successfully_blocked').data(user).send();

        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /users/{id}/unban
     * @summary un-ban user
     * @tags User
     * @security BearerAuth
     * 
     * @param { string } id.path.required - user id - application/json
     * 
     * @return { user.success }             200 - user successfully un banded
     * @return { message.bad_request_error }      400 - user not found
     * @return { message.bad_request_error }      401 - Unauthorized
     * @return { message.server_error}      500 - Server Error
     */
    async unbanned(req, res, next) {
        try {
            let user = await User.findById(req.params.id);
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            user.is_banned = 0;
            user.banned_by = null;
            user.banned_at = null;
            await user.save();

            EventEmitter.emit(UserEvents.UNBANNED, user, req)
            AppResponse.builder(res).message('user.messages.user_successfully_unblocked').data(user).send();

        } catch (err) {
            next(err);
        }
    }


    /**
    * GET /users/{id}/login-history
    * @summary get login history 
    * @tags User
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - user id
    *  
    * @return { user.success }                  200 - get login history
    * @return { message.bad_request_error }      401 - Unauthorized
    * @return { message.notfound_error }         404 - user not found
    * @return { message.server_error}           500 - Server Error
    */
    async loginHistory(req, res, next) {
        try {
            let user = await User.findById(req.params.id);
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            const { page = 1, size = 10 } = req.query
            const loginLog = await loginHistory.paginate({ user_id: user._id }, {
                page: page,
                limit: size,
                sort: { createdAt: -1 }
            });

            AppResponse.builder(res).data(loginLog).message('user.messages.user_login_history_list').send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /users/id/companies
     * 
     * @summary Get user companies
     * @tags User
     * @security BearerAuth
     * 
     * @param  { string } id.path.required - user id
     *
     * @return { user.success }             200 - user successfully found
     * @return { message.bad_request_error } 400 - user not found
     * @return { message.bad_request_error } 401 - Unauthorized
     * @return { message.server_error}      500 - Server Error
     */
    async companies(req, res, next) {
        try {
            const { page = 1, size = 10 } = req.query
            let user = await userService.findByParamId(req)

            let searchQuery = { 'created_by': user._id }
            searchQuery = mergeQuery(searchQuery, req.rbacQuery)

            const userCompanies = await Company.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [
                    { path: 'projects' },
                    {
                        path: 'managers',
                        populate: { path: 'user_id', select: ['firstname', 'lastname', 'avatar'] },
                        select: ['user_id']
                    },
                    { path: 'created_by', select: ['firstname', 'lastname'] }
                ]
            });

            AppResponse.builder(res).data(user).message('user.messages.companies_founded').data(userCompanies).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * PATCH /users/{id}
     * 
     * @summary edit user info
     * @tags User
     * @security BearerAuth
     *
     * @param {string } id.path.required - user id
     * @param {string} request.body          - edit info - application/json
     * 
     * @return { user.success }                 200 - edit successfully 
     * @return { message.bad_request_error }     400 - BadRequest
     * @return { message.bad_request_error }     401 - Unauthorized
     * @return { message.server_error  }        500 - Server Error
     */
    async edit(req, res, next) {
        try {

            let user = await User.findById(req.params.id);
            if (!user) throw new NotFoundError('user.errors.user_notfound')
            let userByUserName = await User.findOne({ '_id': { $ne: user._id }, 'username': req.body.username });
            if (userByUserName) throw new BadRequestError('user.errors.username_already_exists');

            let userByEmail = await User.findOne({ '_id': { $ne: user._id }, 'email': req.body.email });
            if (userByEmail) throw new BadRequestError('user.errors.email_already_exists');

            user.firstname = req.body.firstname
            user.lastname = req.body.lastname
            user.username = req.body.username
            user.email = req.body.email
            await user.save();

            EventEmitter.emit(UserEvents.EDIT_USER, user, req);

            AppResponse.builder(res).status(200).data(user).message('user.messages.user_successfully_edited').send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /users/{id}/fcm-token
    * 
    * @summary set user fcm token
    * @tags User
    * @security BearerAuth
    *
    * @param {string } id.path.required - user id
    * @param {user.set_fcm_token } request.body          - fcm token info - application/json
    * 
    * @return { user.success }                 200 - edit successfully 
    * @return { message.bad_request_error }     400 - BadRequest
    * @return { message.bad_request_error }     401 - Unauthorized
    * @return { message.server_error  }        500 - Server Error
    */
    async setFCMToken(req, res, next) {
        try {

            let fcmToken = await fcmTokenService.findOne({ 'token': req.body.token });
            if (fcmToken) {
                await userService.delete(fcmToken, req.user._id);
            }

            let os = '';
            await systemInfo.osInfo()
                .then(data => {
                    os = data.platform + ' / ' + data.distro + ' / ' + data.release
                })
                .catch(error => console.error(error));

            req.body.created_by = req.user._id;
            req.body.os = os;
            fcmToken = await FCMToken.create(req.body)

            EventEmitter.emit(UserEvents.SET_FCM_TOKEN, req.user, req)

            AppResponse.builder(res).status(200).message("user.messages.set_fcm_token_successfully").data(req.user).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /users/{id}/fcm-token
    * 
    * @summary unset user fcm token
    * @tags User
    * @security BearerAuth
    *
    * @param {string } id.path.required - user id
    * @param {user.set_fcm_token } request.body - fcm token - application/json
    * 
    * @return { user.success }                 200 - edit successfully 
    * @return { message.bad_request_error }     400 - BadRequest
    * @return { message.bad_request_error }     401 - Unauthorized
    * @return { message.server_error  }        500 - Server Error
    */
    async unsetFCMToken(req, res, next) {
        try {
            let user = await userService.findByParamId(req)

            let fcmToken = await fcmTokenService.findOne({ 'token': req.body.token });
            if (!fcmToken) throw new NotFoundError('user.errors.fcm_token_not_found');

            await userService.delete(fcmToken, req.user._id);

            EventEmitter.emit(UserEvents.UNSET_FCM_TOKEN, user, req)
            AppResponse.builder(res).status(200).message("user.messages.unset_fcm_token_successfully").data(user).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /users/{id}/fcm-token
    * 
    * @summary check user fcm token
    * @tags User
    * @security BearerAuth
    *
    * @param {string } id.path.required - user id
    * @param {user.check_fcm_token } request.body - fcm token - application/json
    * 
    * @return { user.success }                 200 - edit successfully 
    * @return { message.bad_request_error }     400 - BadRequest
    * @return { message.bad_request_error }     401 - Unauthorized
    * @return { message.server_error  }        500 - Server Error
    */
    async checkFCMToken(req, res, next) {
        try {
            let user = await userService.findByParamId(req)

            let fcmToken = await fcmTokenService.findOne({ 'token': req.body.token });
            if (!fcmToken) throw new NotFoundError('user.errors.fcm_token_not_found');

            EventEmitter.emit(UserEvents.CHECK_FCM_TOKEN, user, req)
            AppResponse.builder(res).status(200).message("user.messages.fcm_token_not_valid").data(fcmToken).send();
        } catch (err) {
            next(err);
        }
    }

}

export default new UserController;