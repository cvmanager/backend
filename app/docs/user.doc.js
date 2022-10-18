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