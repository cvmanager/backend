import BadRequestError from '../exceptions/BadRequestError.js'
import NotFoundError from '../exceptions/NotFoundError.js';
import userService from '../helper/service/user.service.js';

async function banUserCantSetForManager(req, res, next) {
    try {
        let user = await userService.findOne({ _id: req.body.manager_id });
        if (!user) throw new NotFoundError('user.errors.user_notfound');
        if (user.is_banned) throw new BadRequestError("user.errors.manager_is_banned");
        next();
    } catch (err) {
        next(err);
    }
}

export { banUserCantSetForManager }