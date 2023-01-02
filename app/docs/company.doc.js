/**
* Company
* @typedef { object } Company
* @property { string }  name
* @property { string }  logo
* @property { boolean } is_active
* @property { string }  created_by
* @property { string }  _id
* @property { string }  createdAt
* @property { string }  updatedAt
*/

/**
* create company
* @typedef { object } company.create
* @property { string } name.required - company name
*/

/**
* company success response
* @typedef { object } company.success
* @property { string }         message
* @property { array<Company> } data
* @property { array<> }        errors
*/

/**
* company success response
* @typedef  { object } company.set_manager
 * @property { string } manager_id - user id
*/