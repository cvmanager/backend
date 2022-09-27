const Controller = require('./controller');
const Company = require('../../models/company.model');
const AppResponse = require('../../helper/response');
const BadRequestError = require('../../exceptions/BadRequestError');


class CompanyController extends Controller {

    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query

            let searchQuery = (query.length > 0 ? { $or: [{ name: { '$regex': query } }] } : null);

            let companyList = await Company.find(searchQuery).limit(size).skip(size * (page - 1));
            AppResponse.builder(res).message("succussfully founded").data(companyList).send();
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        try {
            const company = Company.findById(req.params.id);
            if (!company) throw new BadRequestError('company not found!');

            AppResponse.builder(res).message('company successfuly found').data(company).send();
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            req.body.created_by = req.user_id;
            const company = await Company.create(req.body);

            AppResponse.builder(res).status(201).message('company successfuly created').data(company).send();
        } catch (err) {
            next(err)
        }
    }

    async update(req, res, next) {
        try {
            await Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(company => AppResponse.builder(res).message("the company has been successfully updated").data(company).send())
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            let company = await Company.findById(req.params.id);
            if (!company) throw new NotFoundError('company not found');
            await company.delete(req.user_id);
            AppResponse.builder(res).message("company successfully deleted").data(company).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CompanyController