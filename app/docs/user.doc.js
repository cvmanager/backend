/**
 * User
 * @typedef { object } User
 * @property { string } _id
 * @property { string } firstname
 * @property { string } lastname
 * @property { string } mobile
 * @property { string } password
 * @property { string } mobile_verified_at
 * @property { string } avatar
 * @property { string } is_banned
 * @property { Date }   created_by
 * @property { Date }   createdAt
 * @property { Date }   updatedAt
 */

/**
* user success response
* @typedef { object } user.success
* @property { string }         message
* @property { array<Company> } data
* @property { array<> }        errors
*/


/**
* update user avatar
* @typedef { object } user.avatar
* @property { string } avatar.required - user profile image
*/


/**
* change user password
* @typedef { object } user.change-password
* @property { string } password.required - user profile password
* @property { string } old_password.required - user profile password
*/


/**
* user update role
* @typedef { object } user.role
* @property { string } role_id.required
*/


/**
* ckeck user fcm token
* @typedef { object } user.check_fcm_token
* @property { string } token.required - token
*/

/**
* set user fcm token
* @typedef { object } user.set_fcm_token
* @property { string } token.required - token
*/

/**
* un set user fcm token
* @typedef { object } user.unset_fcm_token
* @property { string } token.required - token
*/

