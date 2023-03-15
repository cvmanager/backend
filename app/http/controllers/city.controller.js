import NotFoundError from '../../exceptions/NotFoundError.js';
import City from '../../models/city.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';

class CityController extends Controller {

    /**
    * GET /cities
    * 
    * @summary get a list of all Cities
    * @tags City
    * @security BearerAuth
    * 
    * @return { city.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            const { page = 1, size = 50, query = '' } = req.query
            let searchQuery = (query.length > 0 ? { $or: [{ name: { '$regex': query } }] } : null);
            const CityList = await City.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 }
            });
            AppResponse.builder(res).message("City.message.City_list_found").data(CityList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /cities/{id}
    * 
    * @summary get a city by id
    * @tags City
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - city id
    * 
    * @return { city.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async find(req, res, next) {
        try {
            const city = await City.findById(req.params.id);
            if (!city) throw new NotFoundError('city.errors.city_notfound');

            AppResponse.builder(res).message('city.messages.city_found').data(city).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new CityController