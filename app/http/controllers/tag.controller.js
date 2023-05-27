import Controller from "./controller.js";
import Tag from "../../models/tag.model.js"
import { mergeQuery } from '../../helper/mergeQuery.js';
import AppResponse from "../../helper/response.js";
import tagService from "../../helper/service/tag.service.js";
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import { getRandomColor } from "../../helper/helper.js";

class TagController extends Controller {

    /**
    * GET /tags
    * 
    * @summary get a list of all tag
    * @tags Tag
    * @security BearerAuth
    * 
    * @param  { string } query.path - search for special fields - application/json
    * 
    * @return { tag.success } 200 - success response
    * @return { message.bad_request_error } 400 - BadRequest response
    * @return { message.bad_request_error } 404 - not found response
    * @return { message.unauthorized_error }     401 - Unauthorized
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
                        { name: { '$regex': new RegExp(query, "i") } }
                    ]
                }
            }
            const Tags = await Tag.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 }
            });
            AppResponse.builder(res).message("tag.messages.tag_list_found").data(Tags).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    /**
    * POST /tags
    * 
    * @summary create new tag
    * @tags Tag
    * @security BearerAuth
    * 
    * @param { tag.create } request.body - tag info - application/json
    * 
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.notfound_error }  404 - not found response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {
            let tag = await tagService.findOne({ name: req.body.name });
            if (tag) throw new AlreadyExists('tag.errors.duplicate');

            req.body.created_by = req.user.id;
            req.body.color = getRandomColor();
            tag = await tagService.create(req.body);

            AppResponse.builder(res).status(201).message("tag.messages.tag_successfully_created").data(tag).send();

        } catch (err) {
            next(err);
        }
    }
}

export default new TagController;