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
        const { image_name:imageName } = req.body
        const { id:userId } = req.params
        try {
            if (!imageName) {
                throw new BadRequestError("BadRequest", 'Image File Not Uploaded!');
            }
            const user = await User.findByIdAndUpdate(userId, { avatar: imageName }, { new: true })
            AppResponse.builder(res).message("Profile Image Successfully Uploaded!").data(user).send()
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController;