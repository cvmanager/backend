import NotFoundError from '../../exceptions/NotFoundError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import Project from '../../models/project.model.js';
import Position from '../../models/position.model.js'
import User from '../../models/user.model.js';
import Manager from '../../models/manager.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import EventEmitter from '../../events/emitter.js';
import { PositionEvents } from '../../events/subscribers/positions.subscriber.js'
import Resume from '../../models/resume.model.js';
import BadRequestError from '../../exceptions/BadRequestError.js';
import Company from '../../models/company.model.js';
import i18n from '../../middlewares/lang.middleware.js'
import positionService from '../../helper/service/position.service.js';
import roleService from '../../helper/service/role.service.js';
import userService from '../../helper/service/user.service.js';
import { mergeQuery } from '../../helper/mergeQuery.js';
import managerService from '../../helper/service/manager.service.js';

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

            let searchQuery = (query.length > 0 ? { $or: [{ title: { '$regex': new RegExp(query, "i") } }] } : null);

            searchQuery = mergeQuery(searchQuery, req.rbacQuery)
            const positionList = await Position.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [
                    { path: 'company_id', select: ['_id', 'name', 'logo'] },
                    { path: 'project_id', select: ['_id', 'name', 'logo'] },
                    {
                        path: 'managers',
                        populate: { path: 'user_id', select: ['firstname', 'lastname', 'avatar'] },
                        select: ['user_id', 'type']
                    },
                    { path: 'created_by', select: ['firstname', 'lastname', 'avatar'] }
                ]
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
            const position = await Position.findById(req.params.id)
                .populate([
                    { path: 'company_id', select: ['_id', 'name', 'logo'] },
                    { path: 'project_id', select: ['_id', 'name', 'logo'] },
                    { path: 'created_by', select: ['firstname', 'lastname', 'avatar'] }
                ]);
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

            let company = await Company.findById(project.company_id);
            if (!company.is_active) throw new BadRequestError('project.errors.company_is_not_active');

            let position = await Position.findOne({ 'title': req.body.title, 'project_id': req.body.project_id });
            if (position) throw new AlreadyExists('position.errors.position_already_exists');

            req.body.created_by = req.user._id;
            req.body.company_id = project.company_id;
            position = await Position.create(req.body);

            EventEmitter.emit(PositionEvents.CREATE, position);
            AppResponse.builder(res).status(201).message('position.messages.position_successfully_created').data(position).send();
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
            const position = await positionService.findByParamId(req)
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            if (req.body.title !== undefined) {
                let dupplicatePosition = await Position.findOne({ '_id': { $ne: position._id }, 'title': req.body.title, 'project_id': position.project_id });
                if (dupplicatePosition && dupplicatePosition._id !== position._id) throw new AlreadyExists('position.errors.position_already_exists');
            }

            await Position.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(position => {

                    EventEmitter.emit(PositionEvents.UPDATE, position);
                    AppResponse.builder(res).message("position.messages.position_successfully_updated").data(position).send()
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
            const position = await positionService.findByParamId(req)
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            await position.delete(req.user._id);
            EventEmitter.emit(PositionEvents.DELETE, position);

            AppResponse.builder(res).message("position.messages.position_successfully_deleted").data(position).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /positions/{id}/manager
    * 
    * @summary set manager for position 
    * @tags Position
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - position id
    * @param { position.set_manager } request.body - position info - application/json
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
            const position = await positionService.findByParamId(req)
            if (!position) throw new NotFoundError('position.errors.position_notfound');
            if (!position.is_active) throw new BadRequestError('position.errors.position_deactivate_cant_set_manager');

            let user = await userService.findOne({ _id: req.body.manager_id });

            let manager = await managerService.findOne({ 'entity': "positions", 'entity_id': position.id, 'user_id': user.id });
            if (manager) throw new BadRequestError("project.errors.the_user_is_currently_an_manager_for_position");

            await managerService.create({ user_id: user._id, entity: "positions", entity_id: position._id, created_by: req.user._id });

            const positionManagerRole = await roleService.findOne({ name: "Position Manager" })
            await userService.addRole(user._id, positionManagerRole._id)

            EventEmitter.emit(PositionEvents.SET_MANAGER, position);
            AppResponse.builder(res).status(201).message('manager.messages.manager_successfully_created').data(manager).send();
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
     * @param  { string } id.path.required - position id
     * 
     * @return { position.success }              200 - success response
     * @return { message.badrequest_error }      400 - bad request respone
     * @return { message.badrequest_error }      404 - not found respone
     * @return { message.unauthorized_error }    401 - UnauthorizedError
     * @return { message.server_error  }         500 - Server Error
     */
    async getResumes(req, res, next) {
        try {
            const position = await positionService.findByParamId(req)
            const { size = 10 } = req.query

            let resumes = [];
            let promiseResumes = []

            let statuses = i18n.__("resume.enums.status");
            for (let status of statuses) {
                let resumeList = Resume.find({ 'position_id': position._id, 'status': status })
                    .limit(size)
                    .sort([['index', 1]])
                    .populate([
                        { path: 'position_id' },
                        { path: 'tags', select: ['name', 'color', 'count'] }
                    ]);
                promiseResumes.push(resumeList)
            }
            let results = await Promise.all(promiseResumes)

            for (let i = 0; i < statuses.length; i++) {
                let resume = {}
                resume[statuses[i]] = results[i]
                resumes.push(resume)
            }

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
            const position = await positionService.findByParamId(req)
            let managers = await Manager.find({ 'entity': "positions", 'entity_id': position.id }).populate('user_id');
            AppResponse.builder(res).message('position.messages.position_managers_found').data(managers).send();
        } catch (err) {
            next(err);
        }
    }

    /**
  * PATCH /positions/{id}/active
  * @summary active positions 
  * @tags Position
  * @security BearerAuth
  * 
  * @param { string } id.path.required - position id
  * 
  * @return { position.success }              200 - active positions
  * @return { message.badrequest_error }      400 - positions not found
  * @return { message.badrequest_error }      401 - UnauthorizedError
  * @return { message.server_error}           500 - Server Error
  */
    async active(req, res, next) {
        try {
            const position = await positionService.findByParamId(req)
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            if (position.is_active == true) throw new BadRequestError('position.errors.position_activated_already');

            position.is_active = true;
            await position.save();

            EventEmitter.emit(PositionEvents.ACTIVE, position)
            AppResponse.builder(res).message("position.messages.position_successfully_activated").data(position).send()
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /positions/{id}/deactive
    * @summary deactive positions 
    * @tags Position
    * @security BearerAuth
    * 
    * @param { string } id.path.required - positions id
    * 
    * @return { position.success }              200 - deactive positions
    * @return { message.badrequest_error }      400 - positions not found
    * @return { message.badrequest_error }      401 - UnauthorizedError
    * @return { message.server_error}           500 - Server Error
    */
    async deActive(req, res, next) {
        try {
            const position = await positionService.findByParamId(req)
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            if (position.is_active == false) throw new BadRequestError('position.errors.position_deactivated_already');

            position.is_active = false;
            await position.save();

            EventEmitter.emit(PositionEvents.DEACTIVE, position)
            AppResponse.builder(res).message("position.messages.position_successfully_deactivated").data(position).send()
        } catch (err) {
            next(err);
        }
    }

    /**
* DELETE /positions/{id}/manager
*
* @summary delete manager from position
* @tags Position
* @security BearerAuth
*
* @param  { string } id.path.required - position id - application/json
* @param  { position.delete_manager } request.body - position info - application/json
*
* @return { message.unauthorized_error }     401 - UnauthorizedError
* @return { message.badrequest_error }       404 - NotFoundError
* @return { message.server_error }           500 - Server Error
* @return { position.success }                200 - success respons
*/
    async deleteManager(req, res, next) {
        try {
            let position = await Position.findById(req.params.id);
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            let user = await User.findById(req.body.manager_id);
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            let manager = await Manager.findOne({ 'entity': "positions", 'entity_id': position.id, 'user_id': user.id });
            if (!manager) throw new BadRequestError("position.errors.the_user_is_not_manager_for_this_position");
            if (manager.type === 'owner') throw new BadRequestError("position.errors.the_owner_manager_cannot_be_deleted");

            await manager.delete(req.user._id);
            EventEmitter.emit(PositionEvents.UNSET_MANAGER, position);

            AppResponse.builder(res).message("position.messages.position_manager_deleted").data(position).send()
        } catch (err) {
            next(err);
        }
    }

    /**
   * PATCH /positions/{id}/logo
   * @summary upload position logo
   * @tags Position
   * @security BearerAuth
   * 
   * @param { string } id.path.required - position id
   * @param { position.upload_logo } request.body - position info - multipart/form-data
   * 
   * @return { position.success }               200 - update resume profile
   * @return { message.badrequest_error }      400 - resume not found
   * @return { message.badrequest_error }      401 - UnauthorizedError
   * @return { message.server_error}           500 - Server Error
   */
    async updateLogo(req, res, next) {
        try {
            let position = await Position.findById(req.params.id);
            if (!position) throw new NotFoundError('position.errors.position_notfound');

            if (req.body.logo) {
                position.logo = req.body.logo;
                await position.save();
            }

            AppResponse.builder(res).message("position.messages.position_successfully_updated").data(position).send()
        } catch (err) {
            next(err);
        }
    }

}

export default new PositionController