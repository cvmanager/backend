import Province from '../../models/province.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';

class ProvinceController extends Controller {

    /**
    * GET /provinces
    * 
    * @summary get a list of all provinces
    * @tags Province
    * @security BearerAuth
    * 
    * @return { province.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            const { page = 1, size = 50, query = '' } = req.query
            let searchQuery = (query.length > 0 ? { $or: [{ name: { '$regex': query } }] } : null);
            const provinceList = await Province.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 }
            });
            AppResponse.builder(res).message("province.message.province_list_found").data(provinceList).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new ProvinceController