import BadRequestError from '../../exceptions/BadRequestError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import Company from '../../models/company.model.js';
import User from '../../models/user.model.js'
import Manager from '../../models/manager.model.js'
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import EventEmitter from '../../events/emitter.js';
import { events } from '../../events/subscribers/companies.subscriber.js';
import Project from '../../models/project.model.js';
import Resume from '../../models/resume.model.js';
import i18n from '../../middlewares/lang.middleware.js';
import autoBind from 'auto-bind';
import companyService from '../../helper/service/company.service.js';
import resumeService from '../../helper/service/resume.service.js';
import { mergeQuery } from '../../helper/mergeQuery.js';
import userService from '../../helper/service/user.service.js';
import roleService from '../../helper/service/role.service.js';
import managerService from '../../helper/service/manager.service.js';
import projectService from '../../helper/service/project.service.js';

class CompanyController extends Controller {

    constructor() {
        super()
        autoBind(this)
    }
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

            let searchQuery = (query.length > 0 ? { $or: [{ name: { '$regex': new RegExp(query, "i") } }] } : null);
            searchQuery = mergeQuery(searchQuery, req.rbacQuery)
            const companyList = await Company.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [
                    { path: 'projects' },
                    {
                        path: 'managers',
                        populate: { path: 'user_id', select: ['firstname', 'lastname', 'avatar'] },
                        select: ['user_id']
                    },
                    { path: 'created_by', select: ['firstname', 'lastname'] }
                ]
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
            let company = await companyService.findByParamId(req)

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
            let company = await companyService.findOne({ 'name': req.body.name })
            if (company) throw new AlreadyExists('company.errors.company_already_exists');

            req.body.created_by = req.user._id;
            company = await companyService.create(req.body);

            EventEmitter.emit(events.CREATE, company);

            AppResponse.builder(res).status(201).message('company.messages.company_successfully_created').data(company).send();
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
            let company = await companyService.findByParamId(req)
            if (req.body.name !== undefined) {
                let duplicateCompany = await companyService.findOne({ '_id': { $ne: company._id }, 'name': req.body.name })
                if (duplicateCompany && duplicateCompany._id !== company._id) throw new AlreadyExists('company.errors.company_already_exists');
            }

            company = await companyService.updateOne({ '_id': req.params.id }, req.body)
            EventEmitter.emit(events.UPDATE, company);
            AppResponse.builder(res).message("company.messages.company_successfully_updated").data(company).send()
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
            let company = await companyService.findByParamId(req)
            await company.delete(req.user._id);

            EventEmitter.emit(events.DELETE, company);
            AppResponse.builder(res).message("company.messages.company_successfully_deleted").data(company).send();
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

            let company = await companyService.findByParamId(req)
            if (!company.is_active) throw new BadRequestError('company.errors.company_deactivate_cant_set_manager');

            let user = await userService.findOne({ _id: req.body.manager_id });

            let manager = await managerService.findOne({ 'entity': "companies", 'entity_id': company.id, 'user_id': user.id });
            if (manager) throw new BadRequestError("company.errors.the_user_is_currently_an_manager_for_company");

            await managerService.create({ user_id: user._id, entity: "companies", entity_id: company._id, created_by: req.user._id });

            const companyManagerRole = await roleService.findOne({ name: "Company Manager" })
            await userService.addRole(user._id, companyManagerRole._id)

            EventEmitter.emit(events.SET_MANAGER, company);

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
            let company = await companyService.findByParamId(req)

            let user = await userService.findOne({ _id: req.body.manager_id });
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            let manager = await managerService.findOne({ 'entity': "companies", 'entity_id': company.id, 'user_id': user.id });
            if (!manager) throw new BadRequestError("company.errors.the_user_is_not_manager_for_this_company");
            if (manager.type === 'owner') throw new BadRequestError("company.errors.the_owner_manager_cannot_be_deleted");

            await managerService.delete(manager, req.user._id);

            let isCompanyManager = await managerService.findOne({ 'entity': "companies", 'user_id': user.id, type: 'moderator' });
            if (!isCompanyManager) {
                const companyManagerRole = await roleService.findOne({ name: "Company Manager" })
                await userService.removeRole(user._id, companyManagerRole._id)
            }

            EventEmitter.emit(events.UNSET_MANAGER, company);

            AppResponse.builder(res).message("company.messages.company_manager_successfully_removed").data(company).send()
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /companies/{id}/projects
    * 
    * @summary gets  companies projects list by company id
    * @tags Company
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - company id
    * 
    * @return { company.success }               200 - success response
    * @return { message.badrequest_error }      400 - bad request respone
    * @return { message.badrequest_error }      404 - not found respone
    * @return { message.unauthorized_error }    401 - UnauthorizedError
    * @return { message.server_error  }         500 - Server Error
    */
    async getProjects(req, res, next) {
        try {
            let company = await companyService.findByParamId(req)

            let projects = await projectService.getAll({ 'company_id': company.id }, [
                { path: 'created_by', select: ['firstname', 'lastname'] },
                {
                    path: 'managers',
                    populate: { path: 'user_id', select: ['firstname', 'lastname', 'avatar'] },
                    select: ['user_id']
                }
            ], { 'updatedAt': -1 })

            AppResponse.builder(res).message('company.messages.company_projects_found').data(projects).send();
        } catch (err) {
            next(err);
        }
    }

    /**
 * GET /companies/{id}/managers
 * 
 * @summary gets  companies managers list by company id
 * @tags Company
 * @security BearerAuth
 * 
 * @param  { string } id.path.required - company id
 * 
 * @return { company.success }               200 - success response
 * @return { message.badrequest_error }      400 - bad request respone
 * @return { message.badrequest_error }      404 - not found respone
 * @return { message.unauthorized_error }    401 - UnauthorizedError
 * @return { message.server_error  }         500 - Server Error
 */
    async getManagers(req, res, next) {
        try {
            let company = await companyService.findByParamId(req)

            let managers = await managerService.getAll({ 'entity': "companies", 'entity_id': company.id }, [
                { path: 'created_by', select: ['firstname', 'lastname'] },
                { path: 'user_id' }
            ], { 'updatedAt': -1 })

            AppResponse.builder(res).message('company.messages.company_managers_found').data(managers).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /companies/{id}/resumes
    * 
    * @summary gets  companies resumes list by company id
    * @tags Company
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - company id
    * 
    * @return { company.success }               200 - success response
    * @return { message.badrequest_error }      400 - bad request respone
    * @return { message.badrequest_error }      404 - not found respone
    * @return { message.unauthorized_error }    401 - UnauthorizedError
    * @return { message.server_error  }         500 - Server Error
    */
    async getResumes(req, res, next) {
        try {
            let company = await companyService.findByParamId(req)

            let resumes = await resumeService.getAll({ 'company_id': company.id }, [
                { path: 'created_by', select: ['firstname', 'lastname'] },
                { path: 'project_id' },
                { path: 'position_id' },
            ], { 'updatedAt': -1 })

            AppResponse.builder(res).message('company.messages.company_resumes_found').data(resumes).send();
        } catch (err) {
            next(err);
        }
    }


    /**
    * PATCH /companies/:id/logo
    * @summary upload company logo
    * @tags Company
    * @security BearerAuth
    * 
    * @param { string } id.path.required - company id
    * @param { company.upload_logo } request.body - company info - multipart/form-data
    * 
    * @return { company.success }               200 - update resume profile
    * @return { message.badrequest_error }      400 - resume not found
    * @return { message.badrequest_error }      401 - UnauthorizedError
    * @return { message.server_error}           500 - Server Error
    */
    async updateLogo(req, res, next) {
        try {
            let company = await companyService.findByParamId(req)

            if (req.body.logo) {
                company.logo = req.body.logo;
                await company.save();
            }

            AppResponse.builder(res).message("company.messages.company_successfully_updated").data(company).send()
        } catch (err) {
            next(err);
        }
    }


    /**
    * PATCH /companies/{id}/active
    * @summary active company 
    * @tags Company
    * @security BearerAuth
    * 
    * @param { string } id.path.required - company id
    * 
    * @return { company.success }               200 - active company
    * @return { message.badrequest_error }      400 - company not found
    * @return { message.badrequest_error }      401 - UnauthorizedError
    * @return { message.server_error}           500 - Server Error
    */
    async active(req, res, next) {
        try {
            let company = await companyService.findByParamId(req)

            if (company.is_active == true) throw new BadRequestError('company.errors.company_activated_already');
            company.is_active = true;
            await company.save();

            EventEmitter.emit(events.ACTIVE_COMPANY, company);
            AppResponse.builder(res).message("company.messages.company_successfully_activated").data(company).send()
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /companies/{id}/deactive
    * @summary deactive company 
    * @tags Company
    * @security BearerAuth
    * 
    * @param { string } id.path.required - company id
    * 
    * @return { company.success }               200 - deactive company
    * @return { message.badrequest_error }      400 - company not found
    * @return { message.badrequest_error }      401 - UnauthorizedError
    * @return { message.server_error}           500 - Server Error
    */
    async deActive(req, res, next) {
        try {
            let company = await companyService.findByParamId(req)

            if (company.is_active == false) throw new BadRequestError('company.errors.company_deactivated_already');
            company.is_active = false;
            await company.save();

            EventEmitter.emit(events.DEACTIVE_COMPANY, company);
            AppResponse.builder(res).message("company.messages.company_successfully_deactivated").data(company).send()
        } catch (err) {
            next(err);
        }
    }

    /**
   * GET /companies/{id}/statistics/resume-by-states
   * 
   * @summary gets a company resume by states statistics
   * @tags Company
   * @security BearerAuth
   * 
   * @param  { string } id.path.required - company id
   * 
   * @return { company.success } 200 - success response
   * @return { message.badrequest_error } 400 - bad request respone
   * @return { message.unauthorized_error }     401 - UnauthorizedError
   * @return { message.server_error  }    500 - Server Error
   */
    async resumeByStates(req, res, next) {
        try {
            let company = await companyService.findByParamId(req)

            let statusArray = i18n.__("resume.enums.status");
            let totalResumeByStates = await Resume.aggregate([
                {
                    $match: {
                        company_id: company._id
                    }
                },
                {
                    "$group": {
                        "_id": "$status",
                        "count": {
                            $sum: 1
                        }
                    }
                },
                {
                    '$project': {
                        'state': '$_id',
                        '_id': 0,
                        'count': 1
                    }
                }
            ])

            statusArray.forEach(element => {
                if (totalResumeByStates.find(resume => resume.state !== element)) {
                    totalResumeByStates.push({ 'count': 0, 'state': element });
                }
            })

            AppResponse.builder(res).message("company.messages.company_resume_by_states").data(totalResumeByStates).send()
        } catch (err) {
            next(err);
        }
    }

    /**
   * GET /companies/{id}/statistics/resume-count-by-projects
   * 
   * @summary gets a company resume count by projects statistics
   * @tags Company
   * @security BearerAuth
   * 
   * @param  { string } id.path.required - company id
   * 
   * @return { company.success } 200 - success response
   * @return { message.badrequest_error } 400 - bad request respone
   * @return { message.unauthorized_error }     401 - UnauthorizedError
   * @return { message.server_error  }    500 - Server Error
   */
    async resumeCountByProjects(req, res, next) {
        try {
            let company = await companyService.findByParamId(req)

            let resumeCountByProjects = await Resume.aggregate([
                {
                    $match: {
                        company_id: company._id
                    }
                },
                {
                    "$group": {
                        "_id": "$project_id",
                        "count": {
                            $sum: 1
                        }
                    }
                },
                {
                    '$sort': {
                        'count': -1
                    }
                },
                {
                    '$limit': 5
                },
                {
                    '$lookup': {
                        'from': 'projects',
                        'localField': '_id',
                        'foreignField': '_id',
                        'as': 'project'
                    }
                },
                {
                    '$unwind': {
                        'path': '$project'
                    }
                },
                {
                    '$project': {
                        '_id': 0,
                        'count': 1,
                        'project.name': 1,
                        'project.logo': 1
                    }
                },
            ]);

            AppResponse.builder(res).message("company.messages.company_resume_count_by_projects").data(resumeCountByProjects).send()
        } catch (err) {
            next(err);
        }
    }

    /**
   * GET /companies/{id}/statistics/resume-count-from-month
   * 
   * @summary gets a company resume count from month statistics
   * @tags Company
   * @security BearerAuth
   * 
   * @param  { string } id.path.required - company id
   * 
   * @return { company.success } 200 - success response
   * @return { message.badrequest_error } 400 - bad request respone
   * @return { message.unauthorized_error }     401 - UnauthorizedError
   * @return { message.server_error  }    500 - Server Error
   */
    async resumeCountFromMonth(req, res, next) {
        try {
            let company = await companyService.findByParamId(req)

            let date = new Date();
            let date7MonthAgo = date.setMonth(date.getMonth() - 7)
            date7MonthAgo = new Date(date7MonthAgo);
            const monthsArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

            let resumeCountFromMonth = await Resume.aggregate([
                {
                    $match: {
                        company_id: company._id,
                        // createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }
                        createdAt: { $gte: date7MonthAgo }
                    }
                },
                {
                    $group: {
                        _id: { "year_month": { $substrCP: ["$createdAt", 0, 7] } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year_month": -1 }
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        month_year: {
                            $concat: [
                                { $arrayElemAt: [monthsArray, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
                                "-",
                                { $substrCP: ["$_id.year_month", 0, 4] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: { $push: { k: "$month_year", v: "$count" } }
                    }
                },
                {
                    $project: {
                        data: { $arrayToObject: "$data" },
                        _id: 0
                    }
                }
            ])

            AppResponse.builder(res).message("company.messages.company_resume_count_from_month").data(resumeCountFromMonth).send()
        } catch (err) {
            next(err);
        }
    }

    /**
   * GET /companies/{id}/statistics/resume-state-in-last-month
   * 
   * @summary gets a company resume state in last month statistics
   * @tags Company
   * @security BearerAuth
   * 
   * @param  { string } id.path.required - company id
   * 
   * @return { company.success } 200 - success response
   * @return { message.badrequest_error } 400 - bad request respone
   * @return { message.unauthorized_error }     401 - UnauthorizedError
   * @return { message.server_error  }    500 - Server Error
   */
    async resumeStateInLastMonth(req, res, next) {
        try {
            let company = await companyService.findByParamId(req)

            let date = new Date();
            let date1MonthAgo = date.setMonth(date.getMonth() - 1)
            date1MonthAgo = new Date(date1MonthAgo)

            date = new Date();
            let date2MonthAgo = date.setMonth(date.getMonth() - 2)
            date2MonthAgo = new Date(date2MonthAgo)

            let receivedResumeInLastMonth = await Resume.aggregate([
                {
                    $match: {
                        company_id: company._id
                    }
                },
                {
                    $facet: {
                        'resent_month': [
                            {
                                $match: {
                                    createdAt: {
                                        $gte: date1MonthAgo
                                    }
                                }
                            },
                            {
                                "$group": {
                                    "_id": "",
                                    "count": {
                                        $sum: 1
                                    }
                                }
                            },
                            {
                                '$project': {
                                    '_id': 0,
                                    'count': 1
                                }
                            }
                        ],
                        'last_month': [
                            {
                                $match: {
                                    createdAt: {
                                        $gte: date2MonthAgo,
                                        $lt: date1MonthAgo
                                    }
                                }
                            },
                            {
                                "$group": {
                                    "_id": "",
                                    "count": {
                                        $sum: 1
                                    }
                                }
                            },
                            {
                                '$project': {
                                    '_id': 0,
                                    'count': 1
                                }
                            }
                        ]
                    }
                }

            ])
            let hiredResumeInLastMonth = await this.resumeCountByStateAndMonth(company, 'hired', date1MonthAgo, date2MonthAgo);
            let rejectedResumeInLastMonth = await this.resumeCountByStateAndMonth(company, 'rejected', date1MonthAgo, date2MonthAgo);

            let resumeStateInLastMonth = {
                'received': receivedResumeInLastMonth,
                'hired': hiredResumeInLastMonth,
                'rejected': rejectedResumeInLastMonth,
            }

            AppResponse.builder(res).message("company.messages.company_resume_state_in_last_month").data(resumeStateInLastMonth).send()
        } catch (err) {
            next(err);
        }
    }

    async resumeCountByStateAndMonth(company, status, start, end) {
        let resumeInMonth = await Resume.aggregate([
            {
                $match: {
                    company_id: company._id
                }
            },
            {
                $facet: {
                    'resent_month': [
                        {
                            $match: {
                                'status': status,
                                createdAt: {
                                    $gte: start
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": "$status",
                                "count": {
                                    $sum: 1
                                }
                            }
                        },
                        {
                            '$project': {
                                '_id': 0,
                                'count': 1
                            }
                        }
                    ],
                    'last_month': [
                        {
                            $match: {
                                'status': status,
                                createdAt: {
                                    $gte: end,
                                    $lt: start
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": "$status",
                                "count": {
                                    $sum: 1
                                }
                            }
                        },
                        {
                            '$project': {
                                '_id': 0,
                                'count': 1
                            }
                        }
                    ]
                }
            }

        ])
        return resumeInMonth;
    }



}

export default new CompanyController