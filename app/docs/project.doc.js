/**
 * Project
 * @typedef  { Object } Project
 * @property { string }     _id
 * @property { string }     company_id
 * @property { string }     name
 * @property { string }     description
 * @property { boolean }    is_active
 * @property { Date }       created_by
 * @property { string }     createdAt
 * @property { string }     updatedAt
 */



/**
* create project
* @typedef  { object } project.create
* @property { string } company_id.required
* @property { string } name.required - project name
* @property { string } description.required - project description
*/

/**
 * update project
 * @typedef { object } project.update
 * @property { string } name - project name
 * @property { string } description - project description
 */

/**
* project success response
* @typedef  { object } project.success
* @property { string }         message
* @property { array<Project> } data
* @property { array<> }        errors
*/


/**
* project success response
* @typedef  { object } project.set_manager
 * @property { string } manager_id - user id
*/

/**
* project delete manager response
* @typedef  { object } project.delete_manager
 * @property { string } manager_id - user id
*/


