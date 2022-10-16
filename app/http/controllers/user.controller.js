import BadRequestError from '../../exceptions/BadRequestError.js';
import UserNotFoundError from '../../exceptions/UserNotFoundError.js';
import AppResponse from '../../helper/response.js';
import User from '../../models/user.model.js';
import Controller from './controller.js';

class UserController extends Controller {

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
            AppResponse.builder(res).message("user.suc.list_found").data(users).send();
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        try {
            let user = await User.findById(req.params.id);
            if (!user) throw new UserNotFoundError('user.err.not_found');

            AppResponse.builder(res).message("user.suc.found").data(user).send();
        } catch (err) {
            next(err);
        }
    }

    async uploadProfileImage(req, res, next) {

        try {
            let user = await User.findOneAndUpdate({ _id: req.user_id }, { avatar: req.body.avatar }, { new: true });
            AppResponse.builder(res).message("user.suc.profile_image_updated").data(user).send();
        } catch (err) {
            next(err);
        }
    }

    async banned(req, res, next) {


        try {
            let user = await User.findById(req.params.id);
            if (!user) throw new UserNotFoundError();

            if (user.is_banned) throw new BadRequestError('user.err.user_is_currently_blocked')

            user.is_banned = 1;
            user.banned_by = req.user_id;
            user.banned_at = new Date().toISOString();
            await user.save();

            AppResponse.builder(res).message('user.suc.user_successfully_blocked').data(user).send();

        } catch (err) {
            next(err);
        }
    }
}

export default new UserController;