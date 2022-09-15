const Controller = require('./controller');
const User = require('../../model/user.model');
const AppResponse = require('../../helper/response');
const BadRequestError = require('../../middleware/BadRequestError');
const NotFoundError = require('../../middleware/NotFoundError');
const JWT = require('jsonwebtoken');
const { generateJwtToken, generateJwtRefeshToken } = require('../../helper/jwt');
const bcrypt = require('bcrypt');
class AuthController extends Controller {

    storedTokens = [];
    async login(req, res, next) {
        try {
            let user = await User.findOne({ mobile: req.body.mobile, deleted_at: null });
            if (!user) throw new NotFoundError('user not found');


            let validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) throw new BadRequestError('mobile or password is not match!');

            if (user.is_banded) throw new BadRequestError('user is banded');


            const access_token = await generateJwtToken(user._id)
            const refresh_token = await generateJwtRefeshToken(user._id);

            // let storedToken = this.storedTokens.find(x => x.id == user._id);
            // if (storedToken == undefined) {
            //     this.storedTokens.push({
            //         id: user._id,
            //         token: refresh_token
            //     });
            // } else {
            //     this.storedTokens[this.storedTokens.find(x => x.id == user._id)].token = refresh_token;
            // }

            AppResponse.builder(res).message('successfuly login').data({ access_token, refresh_token }).send();
        } catch (err) {
            next(err);
        }
    }

    async signup(req, res, next) {
        try {

            let user = await User.findOne({ mobile: req.body.mobile });
            if (user) {
                throw new BadRequestError('there is currently a user with entered information in the system');
            }
            let salt = await bcrypt.genSalt(10);
            let hash_password = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                mobile: req.body.mobile,
                password: hash_password,
            });

            const access_token = await generateJwtToken(user._id)
            const refresh_token = await generateJwtRefeshToken(user._id);

            AppResponse.builder(res).status(201).message("Account Successfuly Created").data({ access_token, refresh_token }).send();
        } catch (err) {
            next(err);
        }
    }

    async refresh(req, res, next) {
        try {
            const access_token = await generateJwtToken(req.user_id)
            const refresh_token = await generateJwtRefeshToken(req.user_id);
            AppResponse.builder(res).message('successfuly login').data({ access_token, refresh_token }).send();
        } catch (err) {
            next(err);
        }
    }
}


module.exports = new AuthController;