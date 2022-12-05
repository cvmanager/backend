import BadRequestError from '../../exceptions/BadRequestError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import Company from '../../models/company.model.js';
import Project from '../../models/project.model.js';
import User from '../../models/user.model.js'
import Position from '../../models/position.model.js'
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';

class PositionController extends Controller {

        /**
    * POST /positions
    * 
    * @summary create a position
    * @tags Posinion
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

}

export default new PositionController