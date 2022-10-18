import BadRequestError from '../../exceptions/BadRequestError.js';
import UserNotFoundError from '../../exceptions/UserNotFoundError.js';
import AppResponse from '../../helper/response.js';
import User from '../../models/user.model.js';
import Controller from './controller.js';

class UserController extends Controller {

    /**
     * GET /users
     * 
     * @summary get list of all users
     * @tags User
     * @security BearerAuth
     * 
     * @return { user.success }             200 - get list of all users
     * @return { message.bad_request }     401 - UnauthorizedError
     * @return { message.server_error  }    500 - Server Error
     */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, q: query = '' } = req.query
            let searchQuery = {}
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { firstname: { '$regex': query } },
                        { lastname: { '$regex': query } }
                    ]
                }
            }
            let users = await User
                .find(searchQuery)
                .limit(size)
                .skip(size * (page - 1));
            AppResponse.builder(res).message("user.message.list_found").data(users).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /users/:id
     * @summary get special user by id
     * @tags User
     * @security BearerAuth
     * 
     * @param {string} id.path.required user id
     * 
     * @return { user.success }              200 - find user data
     * @return { message.bad_request }      400 - user not found
     * @return { message.bad_request }      401 - UnauthorizedError
     * @return { message.server_error}      500 - Server Error
     */
    async find(req, res, next) {
        try {
            let user = await User.findById(req.params.id);
            if (!user) throw new UserNotFoundError('user.error.user_notfound');

            AppResponse.builder(res).message("user.message.user_founded").data(user).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /users/avatar
     * @summary update user prifile image
     * @tags User
     * @security BearerAuth
     * 
     * @param { user.avatar } request.body - user info - multipart/form-data
     * 
     * @return { user.success }              200 - update user profile
     * @return { message.bad_request }      400 - user not found
     * @return { message.bad_request }      401 - UnauthorizedError
     * @return { message.server_error}      500 - Server Error
     */
    async uploadProfileImage(req, res, next) {

        try {
            let user = await User.findOneAndUpdate({ _id: req.user_id }, { avatar: req.body.avatar }, { new: true });
            AppResponse.builder(res).message("user.message.profile_image_successfuly_updated").data(user).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /users/:id/ban
     * @summary update user prifile image
     * @tags User
     * @security BearerAuth
     * 
     * @param { user.avatar } id.path.required - user id - application/json
     * 
     * @return { user.success }             200 - user successfuly banded
     * @return { message.bad_request }      400 - user not found
     * @return { message.bad_request }      401 - UnauthorizedError
     * @return { message.server_error}      500 - Server Error
     */
    async banned(req, res, next) {
        try {
            let user = await User.findById(req.params.id);
            if (!user) throw new UserNotFoundError();

            if (user.is_banned) throw new BadRequestError('user.error.user_is_currently_blocked')

            user.is_banned = 1;
            user.banned_by = req.user_id;
            user.banned_at = new Date().toISOString();
            await user.save();

            AppResponse.builder(res).message('user.message.user_successfully_blocked').data(user).send();

        } catch (err) {
            next(err);
        }
    }
}

export default new UserController;