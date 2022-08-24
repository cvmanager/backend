const { check, validationResult } = require('express-validator');

class authValidator {
    registerValidator(req, res) {
        return [
            check('email').isEmail().withMessage("The email entered is wrong"),
            check('password').isLength({ min: 5 }).withMessage("The password entered is weak"),
        ];

    }
}

module.exports = new authValidator ();