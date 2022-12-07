import BadRequestError from '../../exceptions/BadRequestError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import Company from '../../models/company.model.js';
import Project from '../../models/project.model.js';
import Position from '../../models/position.model.js'
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';

class PositionController extends Controller {


    /**
    * GET /positions
    * 
    * @summary get a list of all positions
    * @tags Position
    * @security BearerAuth
    * 
    * @return { position.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query

            let searchQuery = (query.length > 0 ? { $or: [{ title: { '$regex': query } }] } : null);

            const positionList = await Position.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
            });
            AppResponse.builder(res).message("position.message.position_list_found").data(positionList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /positions/{id}
    * 
    * @summary get a position by id
    * @tags Position
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - position id
    * 
    * @return { position.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async find(req, res, next) {
        try {
            const position = await Position.findById(req.params.id);
            if (!position) throw new NotFoundError('position.error.position_notfound');

            AppResponse.builder(res).message('position.message.position_found').data(position).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * POST /positions
    * 
    * @summary create a position
    * @tags Position
    * @security BearerAuth
    * 
    * @param { position.create } request.body - position info - multipart/form-data
    * @param { position.create } request.body - position info - application/json
    
    * @return { position.success }           201 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {
            let project = await Project.findById(req.body.project_id);
            if (!project) throw new NotFoundError('project.error.project_notfound');

            let company = await Company.findById(req.body.company_id);
            if (!company) throw new NotFoundError('company.error.company_notfound');

            let position = await Position.findOne({ 'title': req.body.title, 'project_id': req.body.project_id });
            if (position) throw new AlreadyExists('position.error.position_already_exists');

            req.body.created_by = req.user_id;
            position = await Position.create(req.body);

            AppResponse.builder(res).status(201).message('position.message.position_successfuly_created').data(position).send();
        } catch (err) {
            next(err)
        }
    }

    /**
    * DELETE /positions/{id}
    * 
    * @summary delete a position by id
    * @tags Position
    * @security BearerAuth
    * 
    * @param  { string } id.path - position id
    * 
    * @return { position.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async delete(req, res, next) {
        try {
            let position = await Position.findById(req.params.id);
            if (!position) throw new NotFoundError('position.error.position_notfound');

            await position.delete(req.user_id);
            AppResponse.builder(res).message("position.message.position_successfuly_deleted").data(position).send();
        } catch (err) {
            next(err);
        }
    }

}

export default new PositionController