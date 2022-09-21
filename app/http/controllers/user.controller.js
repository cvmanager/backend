const Controller = require('./controller');
const User = require('../../models/user.model')
const NotFoundError = require('../../exceptions/NotFoundError');
const AppResponse = require('../../helper/response');
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
            AppResponse.builder(res).message("Succussfully Founded!").data(users).send();
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        try {
            const userId = req.params.id
            let user = await User.findById(userId);
            if (!user) {
                throw new NotFoundError('User Not Found');
            }
            AppResponse.builder(res).message("Succussfully Founded!").data(user).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController;