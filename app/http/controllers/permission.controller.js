import AlreadyExists from '../../exceptions/AlreadyExists.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import policyService from '../../services/policy.service.js';
import AppResponse from '../../helper/response.js';
import Policy from '../../models/policy.model.js';
import Controller from './controller.js';
import permissionService from '../../helper/service/permission.service.js';
import Permission from '../../models/permission.model.js';
import { cachePermission } from '../../helper/rbac.js';

class PermissionController extends Controller {

    /**
    * GET /permissions
    * 
    * @summary get a list of all permissions
    * @tags Permission
    * @security BearerAuth
    * 
    * @return { permission.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query

            let searchQuery = (query.length > 0 ? { $or: [{ name: { '$regex': query } }] } : null);

            const permissionList = await Permission.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
            });
            
            AppResponse.builder(res).message("permission.message.permission_list_found").data(permissionList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /permissions/{id}
    * 
    * @summary gets a permission by id
    * @tags Permission
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - permission id
    * 
    * @return { permission.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */

    /**
    * POST /permissions
    * 
    * @summary creates a permission by id
    * @tags Permission
    * @security BearerAuth
    * 
    * @param { permission.create } request.body - permission info - multipart/form-data
    * @param { permission.create } request.body - permission info - application/json
    
    * @return { permission.success }           201 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {
            let permission = await permissionService.findOne({ $or: [{ 'name': req.body.name }, { 'action': req.body.action }] });
            if (permission) throw new AlreadyExists('permission.error.permission_already_exists');

            if (req.body.policies && req.body.policies.length > 0) {
                for (let policy of req.body.policies) {
                    let policyExist = await policyService.findOne(policy)
                    if (!policyExist) throw new NotFoundError('permission.error.policy_not_found'); 
                }
            }
            
            req.body.created_by = req.user._id;
            let createdPermission = await permissionService.create(req.body);
            await cachePermission(createdPermission)

            AppResponse.builder(res).status(201).message("document.message.document_successfuly_created").data(createdPermission).send();
        } catch (err) {
            next(err)
        }
    }

    /**
    * PATCH /permissions/{id}
    * 
    * @summary updates a permission
    * @tags Permission
    * @security BearerAuth
    * 
    * @param  { string } id.path - permission id
    * @param { permission.create } request.body - permission info - multipart/form-data
    * @param { permission.create } request.body - permission info - application/json
    * 
    * @return { permission.success }           200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async update(req, res, next) {
        try {
            if (req.body.name) {
                let permissionExist = await Permission.findOne({ name: req.body.name })
                if (permissionExist && !permissionExist._id.equals(req.params.id)) throw new AlreadyExists('permission.error.name_already_exists');
            }

            if (req.body.policies && req.body.policies.length > 0) {
                for (let policy of req.body.policies) {
                    let policyExist = await Policy.findOne({ _id: policy })
                    if (!policyExist) throw new NotFoundError('permission.error.policy_not_found'); 
                }
            }

            const updatedPermission = await permissionService.updateOne({ _id: req.params.id }, req.body)
            if (!updatedPermission) throw new NotFoundError('document.error.document_notfound'); 
            await cachePermission(updatedPermission)

            AppResponse.builder(res).message("document.message.document_successfuly_updated").data(updatedPermission).send()

        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /permissions/{id}
    * 
    * @summary deletes a permission by id
    * @tags Permission
    * @security BearerAuth
    * 
    * @param  { string } id.path - permission id
    * 
    * @return { permission.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async delete(req, res, next) {
        let permission = await permissionService.findOne({ _id: req.params.id });
        if (!permission) throw new NotFoundError('document.error.document_notfound');

        await permission.delete(req.user._id);
        // delete from cache
        const redisKey = env("REDIS_KEY_RBAC_PERMISSION") + permission._id.toString()
        await redisClient.del(redisKey)
        
        AppResponse.builder(res).message("document.message.document_successfuly_deleted").data(document).send();
    }
}

export default new PermissionController(permissionService)