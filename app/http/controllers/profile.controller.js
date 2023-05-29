import bcrypt from 'bcrypt'
import BadRequestError from '../../exceptions/BadRequestError.js';
import AppResponse from '../../helper/response.js';
import userService from '../../helper/service/user.service.js';
import notificationService from '../../helper/service/notification.service.js';
import User from '../../models/user.model.js';
import Controller from './controller.js';
import { UserEvents } from '../../events/subscribers/user.subscriber.js';
import EventEmitter from '../../events/emitter.js';
import Notification from '../../models/notification.model.js';



class ProfileController extends Controller {

    /**     
      * GET /profile/get-me
      * @summary Get authenticated user information
      * @tags Profile
      * @security BearerAuth
      * 
      * @return { user.success }              200 - User Successfully Found
      * @return { message.bad_request_error } 400 - User NotFound
      * @return { message.bad_request_error } 401 - Unauthorized
      * @return { message.server_error}       500 - Server Error
      */
    async getMe(req, res, next) {
        try {
            console.log("My User", req.user.id);
            let user = await userService.findOne(req.user.id, [
                { path: 'role', select: ['name', 'id', 'permissions'] },
                { path: "fcmtokens", select: ['token'] }
            ])
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            await user.populate({ path: "role.permissions" })

            AppResponse.builder(res).data(user).message('user.messages.user_founded').send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * PATCH /profile/change-password
     * @summary change user password
     * @tags Profile
     * @security BearerAuth
     * 
     * @param { profile.change-password }  request.body   - application/json
     *  
     * @return { user.success }                  200 - Update User Profile
     * @return { message.bad_request_error }     401 - Unauthorized
     * @return { message.notfound_error }        404 - User NotFound
     * @return { message.server_error}           500 - Server Error
     */
    async changePassword(req, res, next) {
        try {
            let validPassword = await bcrypt.compare(req.body.old_password, req.user.password)
            if (!validPassword) throw new BadRequestError('user.errors.incorrect_password');

            let duplicatePassword = await bcrypt.compare(req.body.password, req.user.password)
            if (duplicatePassword) throw new BadRequestError('user.errors.duplicate_password');

            let salt = await bcrypt.genSalt(10);
            let hash_password = await bcrypt.hash(req.body.password, salt);
            let user = await User.findOneAndUpdate({ _id: req.user.id }, { password: hash_password });

            AppResponse.builder(res).data(user).message('user.messages.password_changed').send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /profile/
    * 
    * @summary edit user info
    * @tags Profile
    * @security BearerAuth
    *
    * @param {string} request.body          - edit info - application/json
    * 
    * @return { user.success }                 200 - edit successfully 
    * @return { message.bad_request_error }     400 - BadRequest
    * @return { message.bad_request_error }     401 - Unauthorized
    * @return { message.server_error  }        500 - Server Error
    */
    async edit(req, res, next) {
        try {

            let userByUserName = await User.findOne({ '_id': { $ne: req.user.id }, 'username': req.body.username });
            if (userByUserName) throw new BadRequestError('user.errors.username_already_exists');

            let userByEmail = await User.findOne({ '_id': { $ne: req.user.id }, 'email': req.body.email });
            if (userByEmail) throw new BadRequestError('user.errors.email_already_exists');


            req.user.firstname = req.body.firstname
            req.user.lastname = req.body.lastname
            req.user.username = req.body.username
            req.user.email = req.body.email
            await req.user.save();

            EventEmitter.emit(UserEvents.EDIT_USER, req.user, req);

            AppResponse.builder(res).status(200).data(req.user).message('user.messages.user_successfully_edited').send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /profile/avatar
    * @summary update user profile image
    * @tags Profile
    * @security BearerAuth
    * 
    * @param { user.avatar } request.body - user avatar - multipart/form-data
    * 
    * @return { user.success }              200 - update user profile
    * @return { message.bad_request_error }      400 - user not found
    * @return { message.bad_request_error }      401 - Unauthorized
    * @return { message.server_error}      500 - Server Error
    */
    async uploadProfileImage(req, res, next) {
        try {
            let user = await User.findOneAndUpdate({ _id: req.user.id }, { avatar: req.body.avatar }, { new: true });
            AppResponse.builder(res).message("user.messages.profile_image_successfully_updated").data(user).send();
        } catch (err) {
            next(err);
        }
    }

    /**     
    * GET /profile/notifications
    * @summary List of user notification
    * @tags Profile
    * @security BearerAuth
    * 
    * @return { user.success }              200 - User Successfully Found
    * @return { message.bad_request_error } 400 - User NotFound
    * @return { message.bad_request_error } 401 - Unauthorized
    * @return { message.server_error}       500 - Server Error
    */
    async notifications(req, res, next) {
        try {
            const { page = 1, size = 10, state = 'all' } = req.query

            let searchQuery = { 'user_id': req.user.id };
            switch (state) {
                case 'unseen':
                    searchQuery = { ...searchQuery, 'seen_at': null }
                    break;
                case 'observed':
                    searchQuery = { ...searchQuery, 'seen_at': { $ne: null } }
                    break;
            }

            const notificationList = await Notification.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 }
            });

            AppResponse.builder(res).message("notification.messages.notification_list_found").data(notificationList).send();
        } catch (err) {
            next(err);
        }
    }


    /**     
    * PATCH /profile/seen-notifications
    * @summary Change all notification to observed
    * @tags Profile
    * @security BearerAuth
    * 
    * @return { user.success }              200 - User Successfully Found
    * @return { message.bad_request_error } 400 - User NotFound
    * @return { message.bad_request_error } 401 - Unauthorized
    * @return { message.server_error}       500 - Server Error
    */
    async observedNotifications(req, res, next) {
        try {

            let notifications = await notificationService.getAll({ 'user_id': req.user.id, 'seen_at': null })

            for (let notification of notifications) {
                if (!notification.sent_at) notification.sent_at = new Date();
                notification.seen_at = new Date();
                await notification.save();
            }

            AppResponse.builder(res).message("notification.messages.notification_list_seen").data(notifications).send();
        } catch (err) {
            next(err);
        }
    }
}


export default new ProfileController;