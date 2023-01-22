import { events } from '../../events/subscribers/resumes.subscriber.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import Position from '../../models/position.model.js';
import ResumeComments from '../../models/resumeComment.model.js';
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
            if (!resume) throw new NotFoundError('resume.error.resume_notfound');

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
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');


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
    * @return { message.NotFoundError }     404 - not found respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
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
    * PATCH /resumes/:id/file
    * @summary upload resume file
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { resume.upload_file } request.body - resume info - multipart/form-data
    * 
    * @return { resume.success }              200 - update resume profile
    * @return { message.badrequest_error }      400 - resume not found
    * @return { message.badrequest_error }      401 - UnauthorizedError
    * @return { message.server_error}      500 - Server Error
    */
    async uploadFile(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.error.resume_notfound');

            let files = [];
            if (resume.file) {
                files = resume.file.filter(fileName => {
                    return fileName != null & fileName != "";
                })
            }
            if (req.body.file) files.push(req.body.file);
            resume.file = files;
            await resume.save();

            AppResponse.builder(res).message("resume.message.resume_file_successfuly_upload").data(resume).send()
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /resumes/{ id } /comments
    * 
    * @summary get resume comments list
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * 
    * @return { resumeComment.success }     200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.NotFoundError }     404 - not found respone
    * @return { message.server_error }     500 - Server Error
    */
    async comments(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');

            let resumeComments = await ResumeComments.find({ 'resume_id': resume._id });

            AppResponse.builder(res).message("resume.messages.resume_comments_list_found").data(resumeComments).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * POST /resumes/{id}/comments
    * 
    * @summary add  comments for resume in table
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resumeComment.create} request.body - resume info - application/json
    * 
    * @return { resumeComment.success }     201 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.NotFoundError }     404 - not found respone
    * @return { message.server_error  }     500 - Server Error
    */
    async addComments(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');

            req.body.body = req.body.body
            req.body.resume_id = resume._id
            req.body.created_by = req.user_id

            let resumeCommentsRes = await ResumeComments.create(req.body)
            AppResponse.builder(res).status(201).message("resume.messages.resume_comment_successfuly_created").data(resumeCommentsRes).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new ResumeController;