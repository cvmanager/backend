import Province from '../../models/province.model.js';
import City from '../../models/city.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

class ProvinceController extends Controller {

    /**
    * GET /provinces
    * 
    * @summary get a list of all provinces
    * @tags Province
    * @security BearerAuth
    * 
    * @return { province.success } 200 - success response
    * @return { message.bad_request_error } 400 - BadRequest response
    * @return { message.bad_request_error } 404 - not found response
    * @return { message.unauthorized_error }     401 - Unauthorized
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            const { query = '' } = req.query
            const provinceList = await Province.find({ name: { '$regex': new RegExp(query, "i") } });
            AppResponse.builder(res).message("province.messages.province_list_found").data(provinceList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
* GET /provinces/{id}/cities
* 
* @summary get cities of province by id
* @tags Province
* @security BearerAuth
* 
* @param  { string } id.path.required - province id
* 
* @return { province.success } 200 - success response
* @return { message.bad_request_error } 400 - BadRequest response
* @return { message.bad_request_error } 404 - not found response
* @return { message.unauthorized_error }     401 - Unauthorized
* @return { message.server_error  }    500 - Server Error
*/
    async cities(req, res, next) {
        try {
            let province = await Province.findById(req.params.id);
            if (!province) throw new NotFoundError('province.errors.province_notfound');

            let cities = await City.find({ "province_id": province._id });

            AppResponse.builder(res).message('province.messages.city_list_found').data(cities).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new ProvinceController