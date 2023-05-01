import Controller from "./controller.js";
import Tag from "../../models/tag.model.js"
import { mergeQuery } from '../../helper/mergeQuery.js';
import AppResponse from "../../helper/response.js";
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
}

export default new TagController;