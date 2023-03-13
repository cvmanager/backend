import ForbiddenError from "../exceptions/Forbidden.js"
import redisClient from "../helper/redis_client.js"
import env from "../helper/env.js"
import permissionService from "../helper/service/permission.service.js"
import roleService from "../helper/service/role.service.js"

export async function canAccess(req, res, next) {
    try {
        let permissionName = getPermissionName(req)
        let userRoles = req.user.role
        let rolesChilds = await getRoleChilds(userRoles)
        userRoles = [...userRoles, ...rolesChilds]

        req.roles = await canRole(userRoles, permissionName)
        next()
    } catch (error) {
        next(error)
    }
}

async function canRole(userRoles, permissionName) {
    let roles = []

    let allRoles = await roleService.getAllRoles()
    // getting all possible roles
    for (let role of allRoles) {
        let hasPermission = false;
        role.permissions.map(element => {
            if (element.toLowerCase() === permissionName.toLowerCase()) {
                hasPermission = true;
            }
        });

        if (userRoles.includes(role._id.toString()) && hasPermission) {
            roles.push(role)
        }
    }
    if (roles.length === 0) throw new ForbiddenError
    return roles
}

async function getRoleChilds(roleIds) {
    let childs = []
    // reading from cache
    const redisKey = env("REDIS_KEY_RBAC_ROLES")
    let allRoles = JSON.parse(await redisClient.get(redisKey))
    // reading from db if it's not in cache
    if (!allRoles) {
        allRoles = await roleService.getRolesWithChilds()
        await redisClient.set(redisKey, JSON.stringify(allRoles))
    }

    roleIds.forEach(roleId => {
        let role = allRoles.find(role => role._id === roleId)
        let roleChilds = role && role.childs && role.childs.length > 0 ? role.childs.map(child => child._id) : []
        childs = [...childs, ...roleChilds]
    })

    return childs.reverse()
}

function getPermissionName(req) {
    let path = req.baseUrl

    for (let key of Object.keys(req.params)) {
        path = path.replace(req.params[key], ":" + key)
    }

    let permissionName = req.method + ':' + path
    return permissionName
}

export async function getPermissionRoles(name) {
    let permission

    // getting from cache
    let redisKey = env("REDIS_KEY_RBAC_PERMISSION") + name
    permission = JSON.parse(await redisClient.get(redisKey))

    // gettign from db if not exist in cache
    if (!permission) {
        permission = await permissionService.findOne({ name }, ['roles'])
        // if (!permission) throw 'permission not found'; // TO-DO - igonore or throw error
        if (!permission) throw 'permission not found'
        // updating cache
        await redisClient.set(redisKey, JSON.stringify(permission))
    }

    return permission.roles
}