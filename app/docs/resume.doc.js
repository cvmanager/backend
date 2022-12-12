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
* @property { number }  work_experience
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
* @property { string } email.required - resume email
* @property { number } birth_year.required - resume birth_year
* @property { string } marital_status - resume marital_status
* @property { string } mobile.required - resume mobile
* @property { string } residence_city.required - resume residence_city
* @property { string } work_city.required - resume work_city
* @property { string } education.required - resume education
* @property { string } phone - resume phone
* @property { number } min_salary - resume min_salary
* @property { number } max_salary - resume max_salary
* @property { number } work_experience - resume work_experience
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
* @property { number } work_experience - resume work_experience
* @property { string } military_status - resume military_status
*/

/**
* update status resume
* @typedef { object } resume.update_status
* @property { string } status.required - resume status
*/


/**
* resume success response
* @typedef { object } resume.success
* @property { string }         message
* @property { array<Resume> } data
* @property { array<> }        errors
*/