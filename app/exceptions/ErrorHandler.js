import jsonwebtoken from 'jsonwebtoken';

import UnauthorizedError from './UnauthorizedError.js';
import UserNotFoundError from './UserNotFoundError.js';
import BadRequestError from './BadRequestError.js'
import NotFoundError from './NotFoundError.js';

function errorHandler(err, req, res, next) {
    if (err instanceof NotFoundError) {
        return res.status(404).json({
            message: res.__(err.message),
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof BadRequestError) {
        return res.status(400).json({
            message: res.__(err.message),
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof UnauthorizedError || err instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(401).json({
            message: err.message ? res.__(err.message) : res.__("Unauthorized"),
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof UserNotFoundError) {
        return res.status(400).json({
            message: res.__(err.message),
            errors: err.errors ? err.errors : [],
            data: []
        });
    }


    if (process.env.NODE_ENV == 'development') console.log(err);

    return res.status(500).json({
        message: res.__("Server Error"),
        errors: [],
        data: []
    });

}

export default errorHandler;