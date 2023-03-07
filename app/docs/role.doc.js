/**
 * Role
 * @typedef { object } Role
 * @property { string }         _id
 * @property { string }         name
 * @property { string }         description
 * @property { string }         parent
 * @property { array<string> }  permisssions
 * @property { string }         created_by
 * @property { string }         createdAt
 * @property { string }         updatedAt
*/

/**
 * create role
 * @typedef { object } role.create
 * @property { string }          name.required
 * @property { string }          description
 * @property { string }          parent
 * @property { array<string> }   permissions
 *  
*/

/**
* role success response
* @typedef { object } role.success
* @property { string }           message
* @property { array<Role> }      data
* @property { array<> }          errors
*/