import BadRequestError from '../../exceptions/BadRequestError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import Company from '../../models/company.model.js';
import User from '../../models/user.model.js'
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import { Console } from 'console';

class CompanyController extends Controller {

    /**
    * GET /companies
    * 
    * @summary get a list of all companies
    * @tags Company
    * @security BearerAuth
    * 
    * @return { company.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query

            let searchQuery = (query.length > 0 ? { $or: [{ name: { '$regex': query } }] } : null);

            const companyList = await Company.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [{path: 'projects'}]
            });
            AppResponse.builder(res).message("company.message.company_list_found").data(companyList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /companies/{id}
    * 
    * @summary gets a company by id
    * @tags Company
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - company id
    * 
    * @return { company.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async find(req, res, next) {
        try {
            const company = await Company.findById(req.params.id).populate('created_by');
            if (!company) throw new BadRequestError('company.error.company_notfound');

            AppResponse.builder(res).message('company.message.company_found').data(company).send();
        } catch (err) {
            next(err);
        }
    }


    /**
    * POST /companies
    * 
    * @summary creates a copmany by id
    * @tags Company
    * @security BearerAuth
    * 
    * @param { company.create } request.body - company info - multipart/form-data
    * @param { company.create } request.body - company info - application/json
    
    * @return { company.success }           201 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {
            let company = await Company.findOne({ 'name': req.body.name });
            if (company) throw new AlreadyExists('company.error.company_already_exists');

            req.body.created_by = req.user_id;
            company = await Company.create(req.body);

            AppResponse.builder(res).status(201).message('company.message.company_successfuly_created').data(company).send();
        } catch (err) {
            next(err)
        }
    }

    /**
    * PATCH /companies/{id}
    * 
    * @summary updates a copmany
    * @tags Company
    * @security BearerAuth
    * 
    * @param  { string } id.path - company id
    * @param { company.create } request.body - company info - multipart/form-data
    * @param { company.create } request.body - company info - application/json
    * 
    * @return { company.success }           200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async update(req, res, next) {
        try {
            await Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(company => AppResponse.builder(res).message("company.message.company_successfuly_updated").data(company).send())
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /companies/{id}
    * 
    * @summary deletes a copmany by id
    * @tags Company
    * @security BearerAuth
    * 
    * @param  { string } id.path - company id
    * 
    * @return { company.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async delete(req, res, next) {
        try {
            let company = await Company.findById(req.params.id);
            if (!company) throw new NotFoundError('company.error.company_notfound');
            await company.delete(req.user_id);
            AppResponse.builder(res).message("company.message.company_successfuly_deleted").data(company).send();
        } catch (err) {
            next(err);
        }
    }

    async manager(req, res, next) {
        try {
            let company = await Company.findById(req.params.id);
            if (!company) throw new NotFoundError('company.error.company_notfound');

            let user = await User.findById(req.body.manager_id);
            if (!user) throw new NotFoundError('user.error.user_notfound');

            company.manager_id = req.body.manager_id;
            await company.save();

            AppResponse.builder(res).message("company.message.company_id_successfuly_updated").data(company).send()
        } catch (err) {
            next(err);
        }
    }
}

export default new CompanyController