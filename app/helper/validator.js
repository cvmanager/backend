import { validationResult } from "express-validator";

import BadRequestError from "../exceptions/BadRequestError.js";

function generalValidator(req, res, next) {
    try {
        var errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            let errors = convertErrors(res, errorValidation.errors)

            throw new BadRequestError("system.errors.bad_request", [errors]);
        }
        next();
    } catch (err) {
        next(err)
    }
}

function convertErrors(res, errorList, convertedErrors = {}) {
    for (let error of errorList) {
        if (error.nestedErrors && error.nestedErrors.length > 0) {
            convertedErrors = convertErrors(res, error.nestedErrors, convertedErrors)
            continue;
        }

        let translatedMsg = res.__(error.msg)

        // if field already exist push to array otherwise assign value
        if (convertedErrors[error.param]) {
            convertedErrors[error.param].push(translatedMsg)
        } else {
            convertedErrors[error.param] = [translatedMsg]
        }
    }

    return convertedErrors
}

export default generalValidator