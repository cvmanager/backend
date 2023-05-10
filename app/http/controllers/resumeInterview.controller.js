import { ResumesInterviewEvents } from '../../events/subscribers/resumesInterviews.subscriber.js';
import Interview from '../../models/interview.model.js';
import Resume from '../../models/resume.model.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import EventEmitter from '../../events/emitter.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import { mergeQuery } from '../../helper/mergeQuery.js';
import resumeService from '../../helper/service/resume.service.js';
import userService from '../../helper/service/user.service.js';

class ResumeInterviewController extends Controller {

    /**
    * GET /resumes/{id}/interviews
    * 
    * @summary get a list of all interviews
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * 
    * @return { interview.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {

            await resumeService.findByParamId(req);
            const { page = 1, size = 10, query = '' } = req.query

            let searchQuery = (query.length > 0 ? { $or: [{ description: { '$regex': query } }] } : null);
            searchQuery = mergeQuery(searchQuery, req.rbacQuery)

            const interviewList = await Interview.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [{ path: 'created_by', select: ['firstname', 'lastname', 'avatar'] }]
            });
            AppResponse.builder(res).message("project.messages.resume_list_found").data(interviewList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /resumes/{id}/interviews/{interview_id}
    * 
    * @summary gets a interview by id
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param  { string } interview_id.path.required - interview id
    * 
    * @return { interview.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async find(req, res, next) {
        try {
            await resumeService.findByParamId(req);
            let interview = await Interview.findById(req.params.interview_id).populate({ path: 'created_by', select: ['firstname', 'lastname', 'avatar'] }).exec();
            if (!interview) throw new NotFoundError('interview.errors.interview_notfound');

            AppResponse.builder(res).message("interview.messages.interview_found").data(interview).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * POST /resumes/{id}/interviews
    * 
    * @summary create a interview
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { interview.create } request.body - interview info - application/json
    
    * @return { interview.success }         201 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {

            await resumeService.findByParamId(req);

            let contribution = [];
            if (req.body.contribution) {
                for (let contributer of req.body.contribution) {
                    let user = userService.findById(contributer)
                    if (user) contribution.push(contributer);
                }
            }

            req.body.contribution = contribution
            req.body.created_by = req.user._id
            req.body.event_time = new Date(req.body.event_time)
            req.body.resume_id = req.params.id;
            let interview = await Interview.create(req.body)
            EventEmitter.emit(ResumesInterviewEvents.CREATE, interview, req)

            AppResponse.builder(res).status(201).message("interview.messages.interview_successfully_created").data(interview).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/interviews/{interview_id}
    * 
    * @summary updates a copmany
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { string } interview_id.path.required - interview id
    * @param { interview.update } request.body - interview info - application/json
    * 
    * @return { interview.success }           200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async update(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            let interview = await Interview.findById(req.params.id);
            if (!interview) throw new NotFoundError('interview.errors.interview_notfound');

            if (req.body.event_time) {
                req.body.event_time = new Date(req.body.event_time)
            }

            if (req.body.contribution) {
                contribution = [];
                for (let contributer of req.body.contribution) {
                    let user = userService.findById(contributer)
                    if (user) contribution.push(contributer);
                }
                req.body.contribution = contribution
            }


            await Interview.findByIdAndUpdate(req.params.interview_id, req.body, { new: true })
                .then(interview => {
                    EventEmitter.emit(ResumesInterviewEvents.UPDATE, interview, req);
                    AppResponse.builder(res).message("interview.messages.interview_successfully_updated").data(interview).send();
                })
                .catch(err => {
                    next(err);
                });
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /resumes/{id}/interviews/{interview_id}
    * 
    * @summary deletes a copmany by id
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param  { string } interviews.path - interview id
    * 
    * @return { interview.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async delete(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            if (!resume) throw new NotFoundError('resume.errors.resume_not_found');

            let interview = await Interview.findById(req.params.interview_id);
            if (!interview) throw new NotFoundError('interview.errors.interview_notfound');

            await interview.delete(req.user._id);
            EventEmitter.emit(ResumesInterviewEvents.DELETE, interview, req)


            AppResponse.builder(res).message("interview.messages.interview_successfully_deleted").data(interview).send();
        } catch (err) {
            next(err);
        }
    }

}

export default new ResumeInterviewController