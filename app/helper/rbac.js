import listEndpoints from 'express-list-endpoints'

import permissionService from './service/permission.service.js';
import Permission from '../models/permission.model.js';
import roleService from './service/role.service.js';
import redisClient from './redis_client.js';
import env from './env.js';


export default async function rbacConfig() {
    
    await cacheRoles()

    let permissions = await permissionService.getAll()
    for (let permission of permissions) { await cachePermission(permission) }

    console.log("RBAC config success")
}

export async function createPermissions(app) { // creating list of permissions from endpoints
    let endpointsList = listEndpoints(app)
    endpointsList = endpointsList.reverse()

    for (let endpoint of endpointsList) {
        for (let method of endpoint.methods) {
            let actionName = method + ':' + endpoint.path

            const entity = endpoint.path.split('/')[3]
            let functionName = endpoint.middlewares.at(-1).split('bound ').at(-1)
            
            if (endpoint.methods.length > 1) {
                let functionPostfix
                if (functionName !== 'index' && functionName !== 'find') functionPostfix = " " + functionName

                if(method === 'GET' && endpoint.path.includes(':id')) functionName = 'find'
                else if(method === 'POST') functionName = 'create'
                else if(method === 'PATCH') functionName = 'update'
                else if(method === 'DELETE') functionName = 'delete'
                
                if (functionPostfix) functionName += functionPostfix 
            }

            let endpointExist = await Permission.findOne({ action: actionName })
            if (endpointExist) continue;
            try {
                await Permission.create({ action: actionName, name: entity + ':' + functionName, entity })   
            } catch (error) {}
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