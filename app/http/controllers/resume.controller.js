import { events } from '../../events/subscribers/resumes.subscriber.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import Position from '../../models/position.model.js';
import EventEmitter from '../../events/emitter.js';
import AppResponse from '../../helper/response.js';
import Resume from '../../models/resume.model.js';
import Controller from './controller.js';
import BadRequestError from '../../exceptions/BadRequestError.js';

class ResumeController extends Controller {

    /**
    * GET /resumes
    * 
    * @summary get a list of all resumes
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } query.path - search for special fields - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query

            let searchQuery = {}
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { firstname: { '$regex': query } },
                        { lastname: { '$regex': query } },
                        { email: { '$regex': query } },
                        { mobile: { '$regex': query } },
                        { education: { '$regex': query } },
                        { major: { '$regex': query } },
                        { phone: { '$regex': query } },
                    ]
                }
            }

            const resumeList = await Resume.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [{ path: 'company_id', select: 'name' }, { path: 'project_id', select: 'name' }, { path: 'created_by', select: 'name' }]
            });
            AppResponse.builder(res).message("project.messages.resume_list_found").data(resumeList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /resumes/{id}
    * 
    * @summary gets a resume by id
    * @tags Resume
    * @security BearerAuth
    *
    * @param  { string } id.path.required - resume id
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async find(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id).populate('created_by').exec();
            if (!resume) throw new NotFoundError('resume.errors.project_notfound');

            AppResponse.builder(res).message("resume.messages.project_found").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * POST /resumes
    * 
    * @summary creates a resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { resume.create } request.body - resume info - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {

            let position = await Position.findById(req.body.position_id)
            if (!position) throw new NotFoundError('position.errors.position_not_found');

            req.body.created_by = req.user_id
            req.body.project_id = position.project_id;
            req.body.company_id = position.company_id;

            let resume = await Resume.create(req.body)

            EventEmitter.emit(events.NEW_RESUME, resume)

            AppResponse.builder(res).status(201).message("resume.messages.resume_successfuly_created").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}
    * 
    * @summary updates a resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.update } request.body - resume info - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async update(req, res, next) {
        try {
            await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(resume => {
                    EventEmitter.emit(events.UPDATE, resume)
                    AppResponse.builder(res).message("resume.messages.resume_successfuly_updated").data(resume).send()
                })
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /resumes/{id}
    * 
    * @summary deletes a resume by id
    * @tags Resume
    * @security BearerAuth
    * 
    * 
    * @param  { string } id.path.required - resume id
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async delete(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');
            resume.deleted_at = Date.now();
            resume.deleted_by = req.user_id;

            await resume.save();

            EventEmitter.emit(events.DELETE_RESUME, resume)


            AppResponse.builder(res).message("resume.messages.resume_successfuly_deleted").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /resumes/{id}/status
    * 
    * @summary update status a resume by id
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.update_status } request.body - resume info - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async updateStatus(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);

            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');

            if (resume.status == req.body.status) throw new BadRequestError('resume.errors.can_not_update_status_to_current')

            resume.status_history.push({
                old_status: resume.status,
                new_status: req.body.status,
                createdAt: new Date(),
                created_by: req.user_id
            });
            resume.status = req.body.status;
            await resume.save();

            EventEmitter.emit(events.UPDATE_STATUS, resume)

            AppResponse.builder(res).message("resume.messages.resume_status_successfuly_updated").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * POST /resumes/{id}/call-history
    * 
    * @summary creates a call history for specific resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.call_history } request.body - call history info - application/json
    * 
    * @return { resume.call_history_success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async callHistory(req, res, next) {
        try {

            let resume = await Resume.findById(req.params.id);

            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');

            let calling_date = new Date(req.body.calling_date)
            let recall_at = new Date(req.body.recall_at)
            resume.call_history.push({
                result: req.body.result,
                calling_date: calling_date,
                description: req.body.description,
                recall_at: recall_at,
                created_by: req.user_id
            })
            calling_date = calling_date.getTime()
            recall_at = recall_at.getTime()

            if (calling_date > recall_at) {
                throw new BadRequestError('calling_date must be before recall_at');
            }

            await resume.save()

            EventEmitter.emit(events.UPDATE_STATUS, resume)

            AppResponse.builder(res).message("resume.messages.resume_call_history_successfuly_created").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

}

export default new ResumeController;