import BadRequestError from '../../exceptions/BadRequestError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import Company from '../../models/company.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';

class CompanyController extends Controller {

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

    async find(req, res, next) {
        try {
            const company = Company.findById(req.params.id);
            if (!company) throw new BadRequestError('company.err.not_found');

            AppResponse.builder(res).message('company.suc.found').data(company).send();
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            let company = await Company.findOne({'name':req.body.name});
            if (company) throw new AlreadyExists('company.err.already_exists');

            req.body.created_by = req.user_id;
            company = await Company.create(req.body);

            AppResponse.builder(res).status(201).message('company.suc.created').data(company).send();
        } catch (err) {
            next(err)
        }
    }

    async update(req, res, next) {
        try {
            await Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(company => AppResponse.builder(res).message("company.suc.updated").data(company).send())
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

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