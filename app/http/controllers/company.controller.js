import BadRequestError from '../../exceptions/BadRequestError.js';
import Company from '../../models/company.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';

class CompanyController extends Controller {

    /**
    * GET /companies
    * @summary gets a list of companies
    * @tags company
    * @return { company_success } 200 - success response
    * @return { company_bad_request } 400 - bad request respone
    * @return { company_bad_request } 404 - not found respone
    * @security BearerAuth
    */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query

            let searchQuery = (query.length > 0 ? { $or: [{ name: { '$regex': query } }] } : null);

            let companyList = await Company.find(searchQuery).limit(size).skip(size * (page - 1));
            AppResponse.builder(res).message("company.suc.found").data(companyList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /companies/:id
    * @summary gets a company by id
    * @tags company
    * @param  { string } id.path - company id
    * @return { company_success } 200 - success response
    * @return { company_bad_request } 400 - bad request respone
    * @return { company_bad_request } 404 - not found respone
    * @security BearerAuth
    */
    async find(req, res, next) {
        try {
            const company = Company.findById(req.params.id);
            if (!company) throw new BadRequestError('company.err.not_found');

            AppResponse.builder(res).message('company.suc.found').data(company).send();
        } catch (err) {
            next(err);
        }
    }


    /**
    * POST /companies
    * @summary creates a copmany by id
    * @tags company
    * @param { create_company } request.body - company info - multipart/form-data
    * @param { create_company } request.body - company info - application/json
    * @return { company_success } 200 - success response
    * @return { company_bad_request } 400 - bad request respone
    * @return { company_bad_request } 404 - not found respone
    * @security BearerAuth
    */
    async create(req, res, next) {
        try {
            req.body.created_by = req.user_id;
            const company = await Company.create(req.body);

            AppResponse.builder(res).status(201).message('company.suc.created').data(company).send();
        } catch (err) {
            next(err)
        }
    }

    /**
    * PATCH /companies/:id
    * @summary updates a copmany
    * @tags company
    * @param  { string } id.path - company id
    * @param { create_company } request.body - company info - multipart/form-data
    * @param { create_company } request.body - company info - application/json
    * @return { company_success } 200 - success response
    * @return { company_bad_request } 400 - bad request respone
    * @return { company_bad_request } 404 - not found respone
    * @security BearerAuth
    */
    async update(req, res, next) {
        try {
            await Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(company => AppResponse.builder(res).message("company.suc.updated").data(company).send())
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /companies/:id
    * @summary deletes a copmany by id
    * @tags company
    * @param  { string } id.path - company id
    * @return { company_success } 200 - success response
    * @return { company_bad_request } 400 - bad request respone
    * @return { company_bad_request } 404 - not found respone
    * @security BearerAuth
    */
    async delete(req, res, next) {
        try {
            let company = await Company.findById(req.params.id);
            if (!company) throw new NotFoundError('company.err.not_found');
            await company.delete(req.user_id);
            AppResponse.builder(res).message("company.suc.deleted").data(company).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new CompanyController