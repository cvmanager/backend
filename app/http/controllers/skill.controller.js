import { SkillEvents } from '../../events/subscribers/skill.subscriber.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import EventEmitter from '../../events/emitter.js';
import AppResponse from '../../helper/response.js';
import Skill from '../../models/skill.model.js';
import Controller from './controller.js';
import BadRequestError from '../../exceptions/BadRequestError.js';
import { mergeQuery } from '../../helper/mergeQuery.js';
import skillService from '../../helper/service/skill.service.js';
import { getRandomColor } from '../../helper/helper.js';

class SkillController extends Controller {

    /**
    * GET /skills
    * 
    * @summary get a list of all skill
    * @tags Skill
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

            searchQuery = mergeQuery(searchQuery, req.rbacQuery)
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { firstname: { '$regex': new RegExp(query, "i") } },
                        { lastname: { '$regex': new RegExp(query, "i") } },
                        { email: { '$regex': query } },
                        { mobile: { '$regex': query } },
                        { education: { '$regex': query } },
                        { phone: { '$regex': query } },
                    ]
                }
            }

            const skillList = await Skill.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
            });
            AppResponse.builder(res).message("skill.messages.skill_list_found").data(skillList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * POST /skills
    * 
    * @summary creates a skill
    * @tags Skill
    * @security BearerAuth
    * 
    * @param { resume.create } request.body - skill info - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.NotFoundError }  404 - not found respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {

            req.body.color = getRandomColor();
            req.body.created_by = req.user._id;
            let skill = await skillService.create(req.body)
            EventEmitter.emit(SkillEvents.CREATE, skill, req)

            AppResponse.builder(res).status(201).message("skill.messages.skill_successfully_created").data(skill).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new SkillController;