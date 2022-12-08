import NotFoundError from '../../exceptions/NotFoundError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';

class ProjectController extends Controller {
    /**
     * GET /projects
     * 
     * @summary Get a list of all projects 
     * @tags Project
     * @security BearerAuth
     * 
     * @return { project.success } 200 - success response
     * @return { message.unauthorized_error }     401 - UnauthorizedError
     * @return { message.server_error } 500 - Server Error
     */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query
            let searchQuery = {}
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { name: { '$regex': query } },
                        { description: { '$regex': query } }
                    ]
                }
            }


            const projectList = await Project.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [
                    {path: 'company_id', select: 'name'}, 
                    {path: 'manager_id', select: ['firstname', 'lastname']},
                ],
            });
            AppResponse.builder(res).message("project.message.project_found").data(projectList).send();
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
     * @return { message.unauthorized_error }     401 - UnauthorizedError
     * @return { message.server_error }    500 - Server Error
     */
    async find(req, res, next) {
        try {
            let project = await Project.findById(req.params.id).populate('created_by').exec();
            if (!project) throw new NotFoundError('project.error.project_notfound');

            AppResponse.builder(res).message("project.message.project_found").data(project).send();
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
     * @return { project.success }     201 - Project Successfuly Created  
     * @return { message.unauthorized_error }     401 - UnauthorizedError
     * @return { message.badrequest_error } 400 - Bad Request
     * @return { message.server_error  } 500 - Server Error
     */
    async create(req, res, next) {
        try {
            let project = await Project.findOne({ 'name': req.body.name , 'company_id' : req.body.company_id });
            if (project) throw new AlreadyExists('project.error.project_already_attached_company');

            req.body.created_by = req.user_id;
            project = await Project.create(req.body);
            AppResponse.builder(res).status(201).message("project.message.project_successfuly_created").data(project).send();
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
     * @return { message.unauthorized_error }     401 - UnauthorizedError
     * @return { message.server_error } 500 - Server Error
     */
    async update(req, res, next) {
        try {
            let project = await Project.findOne({ 'name': req.body.name , 'company_id' : req.body.company_id });
            if (project) throw new AlreadyExists('project.error.project_already_attached_company');

            await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(project => AppResponse.builder(res).message("project.message.project_successfuly_updated").data(project).send())
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
            let project = await Project.findById(req.params.id);
            if (!project) throw new NotFoundError('project.error.project_notfound');
            await project.delete(req.user_id);
            AppResponse.builder(res).message("project.message.project_successfuly_deleted").data(project).send();
        } catch (err) {
            next(err);
        }
    }

     /**
     * PATCH manager /projects/{id}/manager
     * 
     * @summary set manager for special project
     * @tags Project
     * @security BearerAuth
     * 
     * @param  { string } id.path - project id - application/json
     * @param  { project.manager } request.body - project info - application/json
     * 
     * @return { message.unauthorized_error }     401 - UnauthorizedError
     * @return { message.unauthorized_error }     404 - NotFoundError
     * @return { message.server_error } 500 - Server Error
     */
    async manager(req, res, next) {
        try {
            let project = await Project.findById(req.params.id);
            if (!project) throw new NotFoundError('project.error.project_notfound');

            let user = await User.findById(req.body.manager_id);
            if (!user) throw new NotFoundError('user.error.user_notfound');

            project.manager_id = req.body.manager_id;
            await project.save();

            AppResponse.builder(res).message("project.message.project_id_successfuly_updated").data(project).send()
        } catch (err) {
            next(err);
        }
    }
}

export default new ProjectController;