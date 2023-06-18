/**
* Company
* @typedef { object } Company
* @property { string }  name
* @property { string }  logo
* @property { string }  description
* @property { string }  phone
* @property { string }  address
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
* @property { string } description - company name
* @property { string } phone - company name
* @property { string } address - company name
*/

/**
* upload logo comapny
* @typedef { object } comapny.upload_logo
* @property { logo } logo.required - comapny logo
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