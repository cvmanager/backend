import { events } from '../../events/subscribers/interviews.subscriber.js';
import Interview from '../../models/interview.model.js';
import Resume from '../../models/resume.model.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import EventEmitter from '../../events/emitter.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';

class InterviewController extends Controller {

    /**
    * GET /interviews
    * 
    * @summary get a list of all interviews
    * @tags Interview
    * @security BearerAuth
    * 
    * @return { interview.success } 200 - success response
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
                        { description: { '$regex': query } },
                    ]
                }
            }

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
    * GET /interviews/{id}
    * 
    * @summary gets a interview by id
    * @tags Interview
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - interview id
    * 
    * @return { interview.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async find(req, res, next) {
        try {
            let interview = await Interview.findById(req.params.id).populate({ path: 'created_by', select: ['firstname', 'lastname', 'avatar'] }).exec();
            if (!interview) throw new NotFoundError('interview.errors.interview_notfound');

            AppResponse.builder(res).message("interview.messages.interview_found").data(interview).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * POST /interviews
    * 
    * @summary create a interview
    * @tags Interview
    * @security BearerAuth
    * 
    * @param { interview.create } request.body - interview info - application/json
    
    * @return { interview.success }         201 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {
            let resume = await Resume.findById(req.body.resume_id);
            if (!resume) throw new NotFoundError('resume.errors.resume_not_found');

            req.body.created_by = req.user_id
            req.body.event_time = new Date(req.body.event_time)
            let interview = await Interview.create(req.body)
            EventEmitter.emit(events.NEW_INTERVIEW, interview)

            AppResponse.builder(res).status(201).message("interview.messages.interview_successfuly_created").data(interview).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /interviews/{id}
    * 
    * @summary updates a copmany
    * @tags Interview
    * @security BearerAuth
    * 
    * @param { string } id.path.required - interview id
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
            let interview = await Interview.findById(req.params.id);
            if (!interview) throw new NotFoundError('interview.errors.interview_notfound');

            if (req.body.event_time) {
                req.body.event_time = new Date(req.body.event_time)
            }

            await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(interview => {
                    EventEmitter.emit(events.UPDATE, interview);
                    AppResponse.builder(res).message("interview.messages.interview_successfuly_updated").data(interview).send();
                })
                .catch(err => {
                    next(err);
                });
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /interviews/{id}
    * 
    * @summary deletes a copmany by id
    * @tags Interview
    * @security BearerAuth
    * 
    * @param  { string } id.path - interview id
    * 
    * @return { interview.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async delete(req, res, next) {
        try {
            let interview = await Interview.findById(req.params.id);
            if (!interview) throw new NotFoundError('interview.errors.interview_notfound');

            await interview.delete(req.user_id);
            EventEmitter.emit(events.DELETE_INTERVIEW, interview)


            AppResponse.builder(res).message("interview.messages.interview_successfuly_deleted").data(interview).send();
        } catch (err) {
            next(err);
        }
    }

}

export default new InterviewController