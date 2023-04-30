/**
* Tag
* @typedef { object } Tag
* @property { string }  _id
* @property { string }  name
* @property { string }  color
* @property { number }  count
* @property { string }  created_by
*/

/**
* create tag
* @typedef { object } tag.create
* @property { string } tag
*/

/**
* remove tag
* @typedef { object } tag.remove
* @property { string } tag_id
*/


/**
* tag success response
* @typedef { object } tag.success
* @property { string }         message
* @property { array<Tag> } data
* @property { array<> }        errors
*/