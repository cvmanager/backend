import jsonwebtoken from 'jsonwebtoken';
import Logger from '../helper/logger.js'
import env from '../helper/env.js'

import UnauthorizedError from './UnauthorizedError.js';
import UserNotFoundError from './UserNotFoundError.js';
import BadRequestError from './BadRequestError.js'
import NotFoundError from './NotFoundError.js';
import NoContentError from './NoContentError.js';
import AlreadyExists from './AlreadyExists.js';
import ManyRequestsError from './ManyRequestsError.js';
import ForbiddenError from './Forbidden.js';


async function errorHandler(err, req, res, next) {

    if (err instanceof NotFoundError) {
        return res.status(404).json({
            message: res.__(err.message),
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof NoContentError) {
        return res.status(204).json({
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
            message: err.message ? res.__(err.message) : res.__("auth.errors.no_authentication"),
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

    if (err instanceof AlreadyExists) {
        return res.status(409).json({
            message: res.__(err.message),
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof ManyRequestsError) {
        return res.status(429).json({
            message: res.__(err.message),
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof ForbiddenError) {
        return res.status(403).json({
            message: res.__(err.message),
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    await Logger.builder(req).setExeption(err);

    return res.status(500).json({
        message: res.__("system.errors.server_error"),
        errors: [],
        data: []
    });

}

export default errorHandler;