/**
* Skill
* @typedef { object } Skill
* @property { string }  _id
* @property { string }  title
* @property { string }  color
* @property { string }  icon
* @property { boolean } is_active
* @property { string }  created_by
*/

/**
* create skill
* @typedef { object } skill.create
* @property { string } title.required - skill title
* @property { string } icon - skill icon
*/

/**
* skill success response
* @typedef { object } skill.success
* @property { string }         message
* @property { array<Skill> } data
* @property { array<> }        errors
*/