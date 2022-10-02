const Controller = require('./controller');
const User = require('../../models/user.model')
const UserNotFoundError = require('../../exceptions/UserNotFoundError');
const AppResponse = require('../../helper/response');
const BadRequestError = require('../../exceptions/BadRequestError');

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
            AppResponse.builder(res).message("user list successfuly found.").data(users).send();
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        try {
            let user = await User.findById(req.params.id);
            if (!user) throw new UserNotFoundError('User Not Found');

            AppResponse.builder(res).message("user successfuly found").data(user).send();
        } catch (err) {
            next(err);
        }
    }

    async uploadProfileImage(req, res, next) {

        try {
            let user = await User.findOneAndUpdate({_id : req.user_id} , {avatar : req.body.avatar} , {new : true});
            AppResponse.builder(res).message("profile image successfully uploaded!").data(user).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController;