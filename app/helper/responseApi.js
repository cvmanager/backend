/**
 * @desc    This file contain Success and Error response for sending to client / user
 * @author  Huda Prasetyo
 * @since   2020
 */

/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {array} data
 */
exports.success = (message, data) => {
    return {
        status: true,
        msg: message,
        errors: [],
        data
    };
};

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {array} errors
 */
exports.error = (message, errors) => {
    return {
        status: false,
        msg: message,
        errors,
        data: []
    };
};
