import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import i18n from '../../middlewares/lang.middleware.js';

class ConstantController extends Controller {

    /**
    * GET /constant
    * 
    * @summary get a list of all constants
    * @tags Constant
    * @security BearerAuth
    * 
    * @return { constant.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            let constant = {};
            const translates = i18n.__('translate');
            for (let translate in translates) {
                let enums = i18n.__('translate.' + translate + '.enums');
                if (Object.keys(enums).length !== 0)
                    constant[translate] = enums
            }
            AppResponse.builder(res).message("constant.messages.constant_list_found").data(constant).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new ConstantController