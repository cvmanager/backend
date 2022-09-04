const { check, validationResult } = require('express-validator');

class projectValidation {
    create(req,res){
        return [
            check('name').notEmpty().withMessage('name is require'),
            check('name').isLength({ min: 10 }).withMessage('name min 10 char'),
            check('description').notEmpty().withMessage('description is require'),
            check('description').isLength({ min: 10 }).withMessage('des min 10 char'),
        ]
    }
}

module.exports = new projectValidation();