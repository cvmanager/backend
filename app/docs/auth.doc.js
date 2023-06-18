/**
 * Auth
 * @typedef  { object } Auth 
 * @property { string } _id
 * @property { string } firstname
 * @property { string } lastname
 * @property { string } mobile
 * @property { string } password
 * @property { string } mobile_verified_at
 * @property { string } avatar
 * @property { string } username
 * @property { string } is_banned
 * @property { Date }   created_by
 * @property { Date }   createdAt
 * @property { Date }   updatedAt
 */


/**
 * login
 * @typedef  { object } auth.login
 * @property { string } mobile.required
 * @property { string } password.required
 */

/**
 * signup
 * @typedef { object } auth.signup
 * @property { string } firstname.required
 * @property { string } lastname.required
 * @property { string } username.required
 * @property { string } mobile.required
 * @property { string } password.required
 */

/**
 * refresh
 * @typedef { object } auth.refresh
 * @property { string } token.required
 */

/**
 * check username
 * @typedef { object } auth.checkUsername
 * @property { string } username.required
 */

/**
 * check verify mobile code
 * @typedef { object } auth.checkVerify
 * @property { string } verify_code.required
 */

/**
 * sign-up success
 * @typedef  { object } auth.success
 * @property { string } access_token
 * @property { string } refresh_token
 */


/**
* auth server success response
* @typedef { object } auth.success_response
* @property { string }     message
* @property { array<auth.success> } data
* @property { array<string> } errors
*/


/**
 * auth user not found
 * @typedef { object } auth.user_notfound
 * @property { string }     message
 * @property { array<string> } data
 * @property { array<string> } errors
 */

/**
* change user password
* @typedef { object } auth.change-password
* @property { string } password.required - user profile password
* @property { string } old_password.required - user profile password
*/