import listEndpoints from 'express-list-endpoints'

import permissionService from './service/permission.service.js';
import Permission from '../models/permission.model.js';
import roleService from './service/role.service.js';
import redisClient from './redis_client.js';
import env from './env.js';


export default async function rbacConfig() {
    
    await cacheRoles()

    let permissions = await permissionService.getAll({}, ['roles'])
    for (let permission of permissions) { await cachePermission(permission) }

    console.log("RBAC config success")
}

export async function createPermissions(app) { // creating list of permissions from endpoints
    const endpointsList = listEndpoints(app)

    for (let endpoint of endpointsList) {
        for (let method of endpoint.methods) {
            let actionName = method + ':' + endpoint.path
            let endpointExist = await Permission.findOne({ action: actionName })
            if (endpointExist) continue;

            await Permission.create({ action: actionName, name: actionName })   
        }
    }
}

export async function cachePermission(permission) {
    const redisKey = env("REDIS_KEY_RBAC_PERMISSION") + permission.action
    await redisClient.set(redisKey, JSON.stringify(permission))
}

export async function cacheRoles() {
    let roles = await roleService.getRolesWithChilds()
    const redisKey = env("REDIS_KEY_RBAC_ROLES")
    await redisClient.set(redisKey, JSON.stringify(roles))
}