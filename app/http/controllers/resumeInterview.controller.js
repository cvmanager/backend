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
    * @return { message.badrequest_error } 400 - bad request response
    * @return { message.badrequest_error } 404 - not found response
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


}

export default new ResumeInterviewController