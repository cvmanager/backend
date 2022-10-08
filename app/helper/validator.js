import { validationResult } from "express-validator";

import BadRequestError from "../exceptions/BadRequestError.js";

function generalValidator(req, res, next) {
    try {
        var errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            let validationErr = errorValidation.errors.map(item => res.__(item.msg));
            throw new BadRequestError("exceptions.bad_request", validationErr);
        }
        next();
    } catch (err) {
        next(err)
    }
}

export default generalValidator