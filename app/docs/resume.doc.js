/**
* Resume
* @typedef { object } Resume
* @property { string }  _id
* @property { string }  company_id
* @property { string }  project_id
* @property { string }  firstname
* @property { string }  lastname
* @property { string }  gender
* @property { string }  email
* @property { number }  birth_year
* @property { string }  marital_status
* @property { string }  status
* @property { string }  mobile
* @property { string }  residence_city
* @property { string }  work_city
* @property { string }  education
* @property { string }  major
* @property { string }  phone
* @property { number }  min_salary
* @property { number }  max_salary
* @property { string }  military_status
* @property { data }    status_updated_at
* @property { string }  created_by
* @property { data }    createdAt
* @property { data }    updatedAt
*/

/**
* create resume
* @typedef { object } resume.create
* @property { string } position_id.required - resume project_id
* @property { string } firstname.required - resume firstname
* @property { string } lastname.required - resume lastname
* @property { string } gender.required - resume gender
* @property { string } email - resume email
* @property { number } birth_year - resume birth_year
* @property { string } marital_status - resume marital_status
* @property { string } mobile.required - resume mobile
* @property { string } residence_city.required - resume residence_city
* @property { string } work_city.required - resume work_city
* @property { string } education - resume education
* @property { string } phone - resume phone
* @property { number } min_salary - resume min_salary
* @property { number } max_salary - resume max_salary
* @property { string } military_status - resume military_status
*/

/**
* update resume
* @typedef { object } resume.update
* @property { string } company_id - resume company_id
* @property { string } project_id - resume project_id
* @property { string } firstname - resume firstname
* @property { string } lastname - resume lastname
* @property { string } gender - resume gender
* @property { string } email - resume email
* @property { number } birth_year - resume birth_year
* @property { string } marital_status - resume marital_status
* @property { string } mobile - resume mobile
* @property { string } residence_city - resume residence_city
* @property { string } work_city - resume work_city
* @property { string } education - resume education
* @property { string } major - resume major
* @property { string } phone - resume phone
* @property { number } min_salary - resume min_salary
* @property { number } max_salary - resume max_salary
* @property { string } military_status - resume military_status
*/

/**
* update status resume
* @typedef { object } resume.update_status
* @property { string } status.required - resume status
* @property { number } index.required - resume index
*/

/**
* upload file resume
* @typedef { object } resume.upload_file
* @property { file } file.required - resume file
*/

/**
* resume success response
* @typedef { object } resume.success
* @property { string }         message
* @property { array<Resume> } data
* @property { array<> }        errors
*/

/**
* create call history
* @typedef { object } resume.call_history
* @property { string } result.required - result
* @property { string } calling_date.required - calling_date
* @property { string } description - description
* @property { string } recall_at - recall_at
*/

/**
* reject resume
* @typedef { object } resume.reject
* @property { string } reject_reason.required - reject_reason
* @property { string } reject_description.required - reject_description
*/

/**
* resume success response
* @typedef { object } resume.call_history_success
* @property { string }         message
* @property { array<resume.call_history> } data
* @property { array<> }        errors
*/

/**
* upload avatar resume
* @typedef { object } resume.upload_avatar
* @property { avatar } avatar.required - resume avatar
*/

/**
* create hired
* @typedef { object } resume.hired
* @property { string } hired_to_date.required - hired_to_date
* @property { number } income.required - recall_at
*/

/**
* create end_cooperation
* @typedef { object } resume.end_cooperation
* @property { string } end_cooperation_date.required - end_cooperation_date
* @property { string } end_cooperation_reason.required - end_cooperation_reason
* @property { string } end_cooperation_description - end_cooperation_description
*/

/**
* set skill for resume
* @typedef { object } resume.set_skill
* @property { string } skill_id.required - skill_id
*/

/**
* unset skill for resume
* @typedef { object } resume.unset_skill
* @property { string } skill_id.required - skill_id
*/

/**
* set tag for resume
* @typedef { object } resume.set_tag
* @property { string } tag_id.required - tag_id
*/

/**
* unset tag for resume
* @typedef { object } resume.unset_tag
* @property { string } tag_id.required - tag_id
*/


/**
* set assigner for resume
* @typedef { object } resume.set_assigners
* @property { string } user_id.required - user_id
*/

/**
* unset assigner for resume
* @typedef { object } resume.unset_assigners
* @property { string } user_id.required - user_id
*/

/**
* action_interview 
* @typedef { object } resume.action_interview 
* @property { string } interview_id.required - interview_id
*/

