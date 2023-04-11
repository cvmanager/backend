/**
* Position
* @typedef { object } Position
* @property { string }  project_id
* @property { string }  company_id
* @property { string } title
* @property { string } level
* @property { boolean } is_active
* @property { string } logo
* @property { string } description
* @property { string }  created_by
* @property { string }  _id
* @property { string }  createdAt
* @property { string }  updatedAt
*/

/**
* create position
* @typedef { object } position.create
* @property { string } project_id.required - position project_id
* @property { string } title.required - position title
* @property { string } level.required - position level
* @property { string } description - position description
*/

/**
* set manager for position
* @typedef { object } position.set_manager
* @property { string } manager_id.required - manager id
*/

/**
* set manager for position
* @typedef { object } position.delete_manager
* @property { string } manager_id.required - manager id
*/

/**
* position success response
* @typedef { object } position.success
* @property { string }         message
* @property { array<Position> } data
* @property { array<> }        errors
*/

/**
* upload logo position
* @typedef { object } position.upload_logo
* @property { logo } logo.required - position logo
*/
