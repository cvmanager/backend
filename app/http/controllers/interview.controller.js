import { events } from '../../events/subscribers/interviews.subscriber.js';
import Interview from '../../models/interview.model.js';
import Resume from '../../models/resume.model.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import EventEmitter from '../../events/emitter.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import BadRequestError from '../../exceptions/BadRequestError.js';

class InterviewController extends Controller {

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
                populate: [{ path: 'created_by', select: ['firstname','lastname','avatar'] }]
            });
            AppResponse.builder(res).message("project.messages.resume_list_found").data(interviewList).send();
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        try {
            let interview = await Interview.findById(req.params.id).populate({path: 'created_by', select: ['firstname','lastname','avatar']}).exec();
            if (!interview) throw new NotFoundError('interview.errors.interview_notfound');

            AppResponse.builder(res).message("interview.messages.interview_found").data(interview).send();
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            let resume = await Resume.findById(req.body.resume_id);
            if (!resume) throw new NotFoundError('resume.errors.resume_not_found');

            req.body.created_by = req.user_id
            req.body.event_time = new Date(parseInt(req.body.event_time))
            let interview = await Interview.create(req.body)
            EventEmitter.emit(events.NEW_INTERVIEW, interview)
            
            AppResponse.builder(res).status(201).message("interview.messages.interview_successfuly_created").data(interview).send();
        } catch (err) {
            next(err);
        }   
    }

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

export default new InterviewController;