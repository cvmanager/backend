import NotFoundError from './NotFoundError.js';
import BadRequestError from './BadRequestError.js'
import UnauthorizedError from './UnauthorizedError.js';
import UserNotFoundError from './UserNotFoundError.js';
import jsonwebtoken from 'jsonwebtoken';
import Logger from '../helper/logger.js'
//================================================
async function errorHandler(err, req, res, next) {


    await Logger.builder(req).setExeption(err);


    if (err instanceof NotFoundError) {
        return res.status(404).json({
            message: err.message,
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof BadRequestError) {
        return res.status(400).json({
            message: err.message,
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof UnauthorizedError || err instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(401).json({
            message: err.message ? err.message : "Unauthorized",
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof UserNotFoundError) {
        return res.status(400).json({
            message: err.message,
            errors: err.errors ? err.errors : [],
            data: []
        });
    }


    if (process.env.NODE_ENV == 'development') console.log(err);

    return res.status(500).json({
        message: "Server Error",
        errors: [],
        data: []
    });

}

export default errorHandler;