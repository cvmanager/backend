import AlreadyExists from '../../exceptions/AlreadyExists.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

import { cacheRoles } from '../../helper/rbac.js';
import AppResponse from '../../helper/response.js';
import permissionService from '../../helper/service/permission.service.js';
import roleService from '../../helper/service/role.service.js';
import Role from '../../models/role.model.js';
import Controller from './controller.js';

class RoleController extends Controller {

    /**
    * GET /roles
    * 
    * @summary get a list of all roles
    * @tags Role
    * @security BearerAuth
    * 
    * @return { role.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query

            let searchQuery = (query.length > 0 ? { $or: [{ name: { '$regex': query } }] } : null);

            const roleList = await Role.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
            });
            
            AppResponse.builder(res).message("role.message.role_list_found").data(roleList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /roles/{id}
    * 
    * @summary gets a role by id
    * @tags Role
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - role id
    * 
    * @return { role.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */


    /**
    * POST /roles
    * 
    * @summary creates a role by id
    * @tags Role
    * @security BearerAuth
    * 
    * @param { role.create } request.body - role info - multipart/form-data
    * @param { role.create } request.body - role info - application/json
    
    * @return { role.success }           201 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {
            let role = await Role.findOne({ 'name': req.body.name });
            if (role) throw new AlreadyExists('role.error.role_already_exists');
            
            if (req.body.parent) {
                let parentExist = await Role.findOne({ _id: req.body.parent })
                if (!parentExist) throw new NotFoundError('role.error.parent_not_found'); 
            }

            if (req.body.permissions && req.body.permissions.length > 0) {
                for (let permission of req.body.permissions) {
                    let permissionExist = await permissionService.findOne(permission)
                    if (!permissionExist) throw new NotFoundError('permission.error.permission_not_found'); 
                }
            }

            req.body.created_by = req.user._id;
            let createdRole = await roleService.create(req.body);
            await cacheRoles()

            AppResponse.builder(res).status(201).message("document.message.document_successfuly_created").data(createdRole).send();
        } catch (err) {
            next(err)
        }
    }

    /**
    * PATCH /roles/{id}
    * 
    * @summary updates a role
    * @tags Role
    * @security BearerAuth
    * 
    * @param  { string } id.path - role id
    * @param { role.create } request.body - role info - multipart/form-data
    * @param { role.create } request.body - role info - application/json
    * 
    * @return { role.success }           200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async update(req, res, next) {
        try {
            if (req.body.name) {
                let roleExist = await Role.findOne({ name: req.body.name })
                if (roleExist && !roleExist._id.equals(req.params.id)) throw new AlreadyExists('role.error.name_already_exists');
            }

            if (req.body.permissions && req.body.permissions.length > 0) {
                for (let permission of req.body.permissions) {
                    let permissionExist = await permissionService.findOne(permission)
                    if (!permissionExist) throw new NotFoundError('permission.error.permission_not_found'); 
                }
            }

            const updatedRole = await roleService.updateOne({ _id: req.params.id }, req.body)
            if (!updatedRole) throw new NotFoundError('document.error.document_notfound'); 
            await cacheRoles()

            AppResponse.builder(res).message("document.message.document_successfuly_updated").data(updatedRole).send()
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /roles/{id}
    * 
    * @summary deletes a role by id
    * @tags Role
    * @security BearerAuth
    * 
    * @param  { string } id.path - role id
    * 
    * @return { role.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async delete(req, res, next) {
        try {
            let role = await roleService.findOne({ _id: req.params.id, ...req.query });
            if (!role) throw new NotFoundError('document.error.document_notfound');
    
            await role.delete(req.user._id);
            // delete from cache
            await cacheRoles()
            
            AppResponse.builder(res).message("document.message.document_successfuly_deleted").data().send();
        } catch (error) {
            next(error)
        }
    }
}

export default new RoleController(roleService, 'role')