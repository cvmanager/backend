import { validationResult } from "express-validator";

import BadRequestError from "../exceptions/BadRequestError.js";

function generalValidator(req, res, next) {
    try {
        var errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            let validationErr = errorValidation.errors.map(item => item.msg);
            throw new BadRequestError("BadRequest", validationErr);
        }
        next();
    } catch (err) {
        next(err)
    }
}

export default generalValidator