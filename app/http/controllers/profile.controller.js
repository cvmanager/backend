import bcrypt from 'bcrypt'
import BadRequestError from '../../exceptions/BadRequestError.js';
import AppResponse from '../../helper/response.js';
import userService from '../../helper/service/user.service.js';
import User from '../../models/user.model.js';
import Controller from './controller.js';


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
}


export default new ProfileController;