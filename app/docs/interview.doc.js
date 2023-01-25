/**
* Interview
* @typedef { object } Interview
* @property { string }  resume_id
* @property { string }  event_time
* @property { string }  event_type
* @property { string }  type
* @property { string }  description
* @property { string }  contribution
* @property { string }  status
* @property { string }  result
*/

/**
* create interview
* @typedef { object } interview.create
* @property { string } resume_id.required - interview resume_id
* @property { string } event_time.required - interview event_time
* @property { string } event_type.required - interview event_type
* @property { string } type.required - interview type
* @property { string } description - interview description
* @property { array<string> } contribution - interview contribution
*/

/**
* update interview
* @typedef { object } interview.update
* @property { string } event_time.required - interview event_time
* @property { string } event_type.required - interview event_type
* @property { string } type.required - interview type
* @property { string } description - interview description
* @property { array<string> } contribution - interview contribution
*/

/**
* interview success response
* @typedef { object } interview.success
* @property { string }           message
* @property { array<Interview> } data
* @property { array<> }          errors
*/
