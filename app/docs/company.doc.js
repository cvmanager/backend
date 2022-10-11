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
* @typedef { object } create_company
* @property { string } name.required - company name
*/

/**
* company success response
* @typedef { object } company_success
* @property { string }         message
* @property { array<Company> } data
* @property { array<> }        errors
*/

/**
* company bad_request response
* @typedef { object } company_bad_request
* @property { string }     message
* @property { array<string> } data
* @property { array<string> } errors
*/