import NotFoundError from '../../exceptions/NotFoundError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import BadRequestError from '../../exceptions/BadRequestError.js';
import Company from '../../models/company.model.js';
import Project from '../../models/project.model.js';
import Position from '../../models/position.model.js';
import User from '../../models/user.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import Manager from '../../models/manager.model.js'
import EventEmitter from '../../events/emitter.js';
import { ProjectEvents } from '../../events/subscribers/projects.subscriber.js';
import Resume from '../../models/resume.model.js';
import { mergeQuery } from '../../helper/mergeQuery.js';
import projectService from '../../helper/service/project.service.js';
import roleService from '../../helper/service/role.service.js';
import userService from '../../helper/service/user.service.js';
import managerService from '../../helper/service/manager.service.js';

class ProjectController extends Controller {
    /**
     * GET /projects
     * 
     * @summary Get a list of all projects 
     * @tags Project
     * @security BearerAuth
     * 
     * @return { project.success }                  200 - success response
     * @return { message.unauthorized_error }       401 - UnauthorizedError
     * @return { message.server_error }             500 - Server Error
     */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query
            let searchQuery = {}
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { name: { '$regex': new RegExp(query, "i") } },
                        { description: { '$regex': query } }
                    ]
                }
            }

            searchQuery = mergeQuery(searchQuery, req.rbacQuery)
            const projectList = await Project.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [
                    { path: 'company_id', select: 'name' },
                    { path: 'managers', populate: { path: 'user_id', select: ['firstname', 'lastname', 'avatar'] }, select: ['user_id', 'type'] },
                    { path: 'created_by', select: ['firstname', 'lastname'] }
                ],
            });
            AppResponse.builder(res).message("project.messages.project_found").data(projectList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /projects/{id}
     * 
     * @summary Get special project info
     * @tags Project
     * @security BearerAuth
     * 
     * @param  { string } id.path - project id
     * 
     * @return { message.unauthorized_error }       401 - UnauthorizedError
     * @return { message.server_error }             500 - Server Error
     */
    async find(req, res, next) {
        try {
            let project = await projectService.findByParamId(req, [
                { path: 'created_by' },
                { path: 'company_id', select: ['_id', 'name'] },
            ]);

            EventEmitter.emit(ProjectEvents.FIND, project, req);

            AppResponse.builder(res).message("project.messages.project_found").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /projects
     * 
     * @summary Create a new project
     * @tags Project
     * @security BearerAuth
     * 
     * @param  { project.create } request.body - project info - application/json
     * 
     * @return { project.success }                  201 - Project successful Created  
     * @return { message.unauthorized_error }       401 - UnauthorizedError
     * @return { message.badrequest_error }         400 - Bad Request
     * @return { message.server_error  }            500 - Server Error
     */
    async create(req, res, next) {
        try {
            let company = await Company.findOne({ '_id': req.body.company_id });
            if (!company) throw new NotFoundError('company.errors.company_notfound');

            if (!company.is_active) throw new BadRequestError('project.errors.disabled_company_create_project_error')

            let project = await Project.findOne({ 'name': req.body.name, 'company_id': company._id });
            if (project) throw new AlreadyExists('project.errors.project_already_attached_company');

            req.body.created_by = req.user._id;
            project = await Project.create(req.body);
            EventEmitter.emit(ProjectEvents.CREATE, project, req)

            AppResponse.builder(res).status(201).message("project.messages.project_successfully_created").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * PATCH /projects/{id}
     * 
     * @summary Update project info 
     * @tags Project
     * @security BearerAuth
     * 
     * @param  { string } id.path - project id
     * @param  { project.update } request.body - project info - application/json
     * 
     * @return { message.unauthorized_error }       401 - UnauthorizedError
     * @return { message.server_error }             500 - Server Error
     */
    async update(req, res, next) {
        try {
            let project = await projectService.findByParamId(req)

            if (req.body.name !== undefined) {
                let duplicateProject = await Project.findOne({ '_id': { $ne: project._id }, 'name': req.body.name, 'company_id': project.company_id });
                if (duplicateProject && duplicateProject._id !== project._id) throw new AlreadyExists('project.errors.project_already_attached_company');
            }

            await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(project => {
                    EventEmitter.emit(ProjectEvents.UPDATE, project, req)
                    AppResponse.builder(res).message("project.messages.project_successfully_updated").data(project).send()
                })
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

    /**
     * DELETE /projects/{id}
     * 
     * @summary Remove special project
     * @tags Project
     * @security BearerAuth
     * 
     * @param  { string } id.path - project id - application/json
     * 
     * @return { message.unauthorized_error }     401 - UnauthorizedError
     * @return { message.server_error } 500 - Server Error
     */
    async delete(req, res, next) {
        try {
            let project = await projectService.findByParamId(req)

            await project.delete(req.user._id);
            EventEmitter.emit(ProjectEvents.DELETE, project, req)

            AppResponse.builder(res).message("project.messages.project_successfully_deleted").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    /**
      * PATCH /projects/{id}/manager
      *
      * @summary set manager for special project
      * @tags Project
      * @security BearerAuth
      *
      * @param  { string } id.path - project id - application/json
      * @param  { project.set_manager } request.body - project info - application/json
      *
      * @return { message.unauthorized_error }     401 - UnauthorizedError
      * @return { message.unauthorized_error }     404 - NotFoundError
      * @return { message.server_error }           500 - Server Error
      */
    async manager(req, res, next) {
        try {
            let project = await projectService.findByParamId(req)
            let user = await userService.findOne({ _id: req.body.manager_id });

            let manager = await managerService.findOne({ 'entity': "projects", 'entity_id': project.id, 'user_id': user.id });
            if (manager) throw new BadRequestError("project.errors.the_user_is_currently_an_manager_for_project");

            await managerService.create({ user_id: user._id, entity: "projects", entity_id: project._id, created_by: req.user._id });

            const projectManagerRole = await roleService.findOne({ name: "Project Manager" })
            await userService.addRole(user._id, projectManagerRole._id)

            EventEmitter.emit(ProjectEvents.SET_MANAGER, project, req)
            AppResponse.builder(res).status(201).message("project.messages.project_manager_successfully_updated").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /projects/{id}/manager
    *
    * @summary delete manager for special project
    * @tags Project
    * @security BearerAuth
    *
    * @param  { string } id.path - project id - application/json
    * @param  { project.delete_manager } request.body - project info - application/json
    *
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.unauthorized_error }     404 - NotFoundError
    * @return { message.server_error }           500 - Server Error
    */
    async deleteManager(req, res, next) {
        try {
            let project = await projectService.findByParamId(req)

            let user = await User.findById(req.body.manager_id);
            if (!user) throw new NotFoundError("user.errors.user_notfound");

            let manager = await Manager.findOne({ 'entity': "projects", 'entity_id': project.id, 'user_id': user.id });
            if (!manager) throw new BadRequestError("project.errors.the_user_is_not_an_manager_for_project");
            if (manager.type === 'owner') throw new BadRequestError("project.errors.the_owner_manager_cannot_be_deleted");

            EventEmitter.emit(ProjectEvents.UNSET_MANAGER, project, req)
            await manager.delete(req.user._id);

            let isProjectManager = await Manager.findOne({ 'entity': "projects", 'user_id': user.id, type: 'moderator' });
            if (!isProjectManager) {
                const projectManagerRole = await roleService.findOne({ name: "Project Manager" })
                await userService.removeRole(user._id, projectManagerRole._id)
            }

            AppResponse.builder(res).status(200).message("project.messages.project_manager_successfully_deleted").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /projects/{id}/positions
    * 
    * @summary gets  project positions list by project id
    * @tags Project
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - project id
    * 
    * @return { project.success }               200 - success response
    * @return { message.badrequest_error }      400 - bad request respone
    * @return { message.badrequest_error }      404 - not found respone
    * @return { message.unauthorized_error }    401 - UnauthorizedError
    * @return { message.server_error  }         500 - Server Error
    */
    async getPositions(req, res, next) {
        try {
            let project = await projectService.findByParamId(req, ['created_by'])

            let positions = await Position.find({ 'project_id': project.id }).populate('created_by');

            AppResponse.builder(res).message('project.messages.project_positions_found').data(positions).send();
        } catch (err) {
            next(err);
        }
    }

    /**
* GET /projects/{id}/managers
* 
* @summary gets  project managers list by project id
* @tags Project
* @security BearerAuth
*
* @param  { string } id.path.required - project id
* 
* @return { project.success }               200 - success response
* @return { message.badrequest_error }      400 - bad request respone
* @return { message.badrequest_error }      404 - not found respone
* @return { message.unauthorized_error }    401 - UnauthorizedError
* @return { message.server_error  }         500 - Server Error
*/
    async getManagers(req, res, next) {
        try {
            let project = await projectService.findByParamId(req, ['created_by'])

            let managers = await Manager.find({ 'entity': "projects", 'entity_id': project.id }).populate('user_id');

            AppResponse.builder(res).message('project.messages.project_managers_found').data(managers).send();
        } catch (err) {
            next(err);
        }
    }


    /**
    * GET /projects/{id}/resumes
    * 
    * @summary gets  projects resumes list by project id
    * @tags Project
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - project id
    * 
    * @return { project.success }               200 - success response
    * @return { message.badrequest_error }      400 - bad request respone
    * @return { message.badrequest_error }      404 - not found respone
    * @return { message.unauthorized_error }    401 - UnauthorizedError
    * @return { message.server_error  }         500 - Server Error
    */
    async getResumes(req, res, next) {
        try {
            let project = await projectService.findByParamId(req, ['created_by'])

            let resumes = await Resume.find({ 'project_id': project.id }).populate('position_id').populate('company_id');

            AppResponse.builder(res).message('project.messages.project_resumes_found').data(resumes).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * PATCH /projects/{id}/active
     * @summary active projects 
     * @tags Project
     * @security BearerAuth
     * 
     * @param { string } id.path.required - projects id
     * 
     * @return { project.success }               200 - active projects
     * @return { message.badrequest_error }      400 - projects not found
     * @return { message.badrequest_error }      401 - UnauthorizedError
     * @return { message.server_error}           500 - Server Error
     */
    async active(req, res, next) {
        try {
            let project = await projectService.findByParamId(req)

            if (project.is_active == true) throw new BadRequestError('project.errors.project_activated_already');

            project.is_active = true;
            await project.save();

            EventEmitter.emit(ProjectEvents.ACTIVE, project, req)
            AppResponse.builder(res).message("project.messages.project_successfully_activated").data(project).send()
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /projects/{id}/deactive
    * @summary deactive projects 
    * @tags Project
    * @security BearerAuth
    * 
    * @param { string } id.path.required - projects id
    * 
    * @return { project.success }               200 - deactive projects
    * @return { message.badrequest_error }      400 - projects not found
    * @return { message.badrequest_error }      401 - UnauthorizedError
    * @return { message.server_error}           500 - Server Error
    */
    async deActive(req, res, next) {
        try {
            let project = await projectService.findByParamId(req)

            if (project.is_active == false) throw new BadRequestError('project.errors.project_deactivated_already');

            project.is_active = false;
            await project.save();

            EventEmitter.emit(ProjectEvents.DEACTIVE, project, req)
            AppResponse.builder(res).message("project.messages.project_successfully_deactivated").data(project).send()
        } catch (err) {
            next(err);
        }
    }

    /**
* PATCH /projects/{id}/logo
* @summary upload project logo
* @tags Project
* @security BearerAuth
* 
* @param { string } id.path.required - project id
* @param { project.upload_logo } request.body - project info - multipart/form-data
* 
* @return { project.success }               200 - update resume profile
* @return { message.badrequest_error }      400 - resume not found
* @return { message.badrequest_error }      401 - UnauthorizedError
* @return { message.server_error}           500 - Server Error
*/
    async updateLogo(req, res, next) {
        try {
            let project = await projectService.findByParamId(req)

            if (req.body.logo) {
                project.logo = req.body.logo;
                await project.save();
            }

            AppResponse.builder(res).message("project.messages.project_successfully_updated").data(project).send()
        } catch (err) {
            next(err);
        }
    }


}

export default new ProjectController;