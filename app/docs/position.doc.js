/**
* Position
* @typedef { object } Position
* @property { string }  project_id
* @property { string }  company_id
* @property { string } title
* @property { string } level
* @property { boolean } is_active
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
* @property { string } level - position level
* @property { boolean } is_active - position is_active
*/

/**
* position success response
* @typedef { object } position.success
* @property { string }         message
* @property { array<Position> } data
* @property { array<> }        errors
*/