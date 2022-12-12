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
            AppResponse.builder(res).message("position.messages.position_list_found").data(positionList).send();
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
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            AppResponse.builder(res).message('position.messages.position_found').data(position).send();
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
            if (!project) throw new NotFoundError('project.errors.project_notfound');

            let position = await Position.findOne({ 'title': req.body.title, 'project_id': req.body.project_id });
            if (position) throw new AlreadyExists('position.errors.position_already_exists');

            req.body.created_by = req.user_id;
            req.body.company_id = project.company_id;
            position = await Position.create(req.body);

            AppResponse.builder(res).status(201).message('position.messages.position_successfuly_created').data(position).send();
        } catch (err) {
            next(err)
        }
    }

    /**
    * PATCH /positions/{id}
    * 
    * @summary updates a copmany
    * @tags Position
    * @security BearerAuth
    * 
    * @param  { string } id.path - position id
    * @param { position.create } request.body - position info - application/json
    * 
    * @return { position.success }           200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async update(req, res, next) {
        try {

            let position = await Position.findById(req.params.id);
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            if (req.body.project_id !== undefined) {
                let project = await Project.findById(req.body.project_id);
                if (!project) throw new NotFoundError('project.errors.project_notfound');
            }

            if (req.body.company_id !== undefined) {
                let company = await Company.findById(req.body.company_id);
                if (!company) throw new NotFoundError('company.errors.company_notfound');
            }

            if (req.body.title !== undefined) {
                let position = await Position.findOne({ 'title': req.body.title, 'project_id': req.body.project_id !== undefined ? req.body.project_id : req.params.id });
                if (position) throw new AlreadyExists('position.errors.position_already_exists');
            }

            await Position.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(position => AppResponse.builder(res).message("position.messages.position_successfuly_updated").data(position).send())
                .catch(err => next(err));
        } catch (err) {
            next(err);
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
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            await position.delete(req.user_id);
            AppResponse.builder(res).message("position.messages.position_successfuly_deleted").data(position).send();
        } catch (err) {
            next(err);
        }
    }

}

export default new PositionController