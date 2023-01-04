/**
* Resume comment
* @typedef { object } ResumeComment
* @property { string }  _id
* @property { string }  resume_id
* @property { string }  body
* @property { string }  created_by
*/

/**
* create resume comment
* @typedef { object } resumeComment.create
* @property { string }  body
*/

/**
* resume comment success response
* @typedef { object } resumeComment.success
* @property { string }         message
* @property { array<ResumeComment> } data
* @property { array<> }        errors
*/