/**
* Permission
* @typedef { object } Permission
* @property { string }         _id
* @property { string }         name
* @property { array<string> }  policies
* @property { string }         created_by
* @property { string }         createdAt
* @property { string }         updatedAt
*/

/**
* create permission
* @typedef { object } permission.create
* @property { string }          name.required
* @property { string }          description
* @property { array<string> }   policies 
*/

/**
* permission success response
* @typedef { object } permission.success
* @property { string }           message
* @property { array<Permission> } data
* @property { array<> }          errors
*/