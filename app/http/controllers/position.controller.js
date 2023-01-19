import NotFoundError from '../../exceptions/NotFoundError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import Project from '../../models/project.model.js';
import Position from '../../models/position.model.js'
import User from '../../models/user.model.js';
import Manager from '../../models/manager.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import EventEmitter from '../../events/emitter.js';
import { events } from '../../events/subscribers/positions.subscriber.js'
import Resume from '../../models/resume.model.js';

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
                populate: {
                    path: 'managers',
                    populate: { path: 'user_id', select: ['firstname', 'lastname', 'avatar'] },
                    select: ['user_id']
                }
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

            EventEmitter.emit(events.CREATE, position);
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

            if (req.body.title !== undefined) {
                let dupplicatePosition = await Position.findOne({ 'title': req.body.title, 'project_id': position.project_id });
                if (dupplicatePosition && dupplicatePosition._id !== position._id) throw new AlreadyExists('position.errors.position_already_exists');
            }

            await Position.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(position => {

                    EventEmitter.emit(events.UPDATE, position);
                    AppResponse.builder(res).message("position.messages.position_successfuly_updated").data(position).send()
                })
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
            EventEmitter.emit(events.DELETE, position);

            AppResponse.builder(res).message("position.messages.position_successfuly_deleted").data(position).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * POST /positions/{id}/manager
    * 
    * @summary set manager for position 
    * @tags Position
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - position id
    * @param { position.manager } request.body - position info - application/json
    *    
    * @return { manager.success }           201 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    *
    */
    async manager(req, res, next) {

        try {
            let position = await Position.findById(req.params.id);
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            let user = await User.findById(req.body.manager_id);
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            const duplicateManager = await Manager.findOne({ 'user_id': user._id, 'entity_id': position._id, 'entity': 'positions' })
            if (duplicateManager) {
                throw new AlreadyExists('manager.errors.duplicate');
            }

            const manager = await Manager.create({ 'user_id': user._id, 'entity_id': position._id, 'entity': 'positions', 'created_by': req.user_id });
            EventEmitter.emit(events.SET_MANAGER, position);

            AppResponse.builder(res).status(201).message('manager.messages.manager_successfuly_created').data(manager).send();
        } catch (err) {
            next(err);
        }

    }

    /**
     * GET /positions/{id}/resumes
     * 
     * @summary gets  positions resumes list by position id
     * @tags Position
     * @security BearerAuth
     * 
     * @param  { string } id.path.required - company id
     * 
     * @return { position.success }              200 - success response
     * @return { message.badrequest_error }      400 - bad request respone
     * @return { message.badrequest_error }      404 - not found respone
     * @return { message.unauthorized_error }    401 - UnauthorizedError
     * @return { message.server_error  }         500 - Server Error
     */
    async getResumes(req, res, next) {
        try {
            const position = await Position.findById(req.params.id).populate('created_by');
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            let resumes = await Resume.find({ 'position_id': position.id }).populate('project_id').populate('company_id');

            AppResponse.builder(res).message('company.messages.company_resumes_found').data(resumes).send();
        } catch (err) {
            next(err);
        }
    }


       /**
    * GET /positions/{id}/managers
    * 
    * @summary gets  position managers list by position id
    * @tags Position
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - position id
    * 
    * @return { position.success }              200 - success response
    * @return { message.badrequest_error }      400 - bad request respone
    * @return { message.badrequest_error }      404 - not found respone
    * @return { message.unauthorized_error }    401 - UnauthorizedError
    * @return { message.server_error  }         500 - Server Error
    */
       async getManagers(req, res, next) {
        try {
            const position = await Position.findById(req.params.id).populate('created_by');
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            let managers = await Manager.find({ 'entity': "positions", 'entity_id': position.id }).populate('user_id');

            AppResponse.builder(res).message('position.messages.position_managers_found').data(managers).send();
        } catch (err) {
            next(err);
        }
    }

}

export default new PositionController