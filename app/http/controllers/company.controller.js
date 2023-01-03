import BadRequestError from '../../exceptions/BadRequestError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import Company from '../../models/company.model.js';
import User from '../../models/user.model.js'
import Manager from '../../models/manager.model.js'
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import EventEmitter from '../../events/emitter.js';
import { companyEvents } from '../../events/subscribers/companies.subscriber.js';


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
                populate: [{ path: 'projects' }]
            });
            AppResponse.builder(res).message("company.messages.company_list_found").data(companyList).send();
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
            if (!company) throw new BadRequestError('company.errors.company_notfound');

            AppResponse.builder(res).message('company.messages.company_found').data(company).send();
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
            if (company) throw new AlreadyExists('company.errors.company_already_exists');

            req.body.created_by = req.user_id;
            company = await Company.create(req.body);

            EventEmitter.emit(companyEvents.CREATE, company);

            AppResponse.builder(res).status(201).message('company.messages.company_successfuly_created').data(company).send();
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
    * @param  { string } id.path.required - company id
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
                .then(company => {
                    EventEmitter.emit(companyEvents.UPDATE, company);
                    AppResponse.builder(res).message("company.messages.company_successfuly_updated").data(company).send()
                })
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
            if (!company) throw new NotFoundError('company.errors.company_notfound');
            await company.delete(req.user_id);

            EventEmitter.emit(companyEvents.DELETE, company);
            AppResponse.builder(res).message("company.messages.company_successfuly_deleted").data(company).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /companies/{id}/manager
    *
    * @summary set manager for company
    * @tags Company
    * @security BearerAuth
    *
    * @param  { string } id.path - company id - application/json
    * @param  { Company.set_manager } request.body - company info - application/json
    *
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.badrequest_error }       404 - NotFoundError
    * @return { message.server_error }           500 - Server Error
    * @return { company.success }                201 - success respons
    */
    async manager(req, res, next) {
        try {
            let company = await Company.findById(req.params.id);
            if (!company) throw new NotFoundError('company.errors.company_notfound');

            let user = await User.findById(req.body.manager_id);
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            let manager = await Manager.findOne({ 'entity': "companies", 'entity_id': company.id, 'user_id': user.id });
            if (manager) throw new BadRequestError("company.errors.the_user_is_currently_an_manager_for_company");

            await Manager.create({ user_id: user._id, entity: "companies", entity_id: company._id, created_by: req.user_id });

            EventEmitter.emit(companyEvents.SET_MANAGER, company);

            AppResponse.builder(res).status(201).message("company.messages.company_manager_successfully_created").data(company).send();
        } catch (err) {
            next(err);
        }
    }

    /**
   * DELETE /companies/{id}/manager
   *
   * @summary delete manager from company
   * @tags Company
   * @security BearerAuth
   *
   * @param  { string } id.path - company id - application/json
   * @param  { Company.set_manager } request.body - company info - application/json
   *
   * @return { message.unauthorized_error }     401 - UnauthorizedError
   * @return { message.badrequest_error }       404 - NotFoundError
   * @return { message.server_error }           500 - Server Error
   * @return { company.success }                200 - success respons
   */
    async deleteManager(req, res, next) {
        try {
            let company = await Company.findById(req.params.id);
            if (!company) throw new NotFoundError('company.errors.company_notfound');

            let user = await User.findById(req.body.manager_id);
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            let manager = await Manager.findOne({ 'entity': "companies", 'entity_id': company.id, 'user_id': user.id });
            if (!manager) throw new BadRequestError("company.errors.the_user_is_not_manager_for_this_company");

            await manager.delete(req.user_id);

            EventEmitter.emit(companyEvents.UNSET_MANAGER, company);

            AppResponse.builder(res).message("company.messages.company_id_successfuly_updated").data(company).send()
        } catch (err) {
            next(err);
        }
    }
}

export default new CompanyController