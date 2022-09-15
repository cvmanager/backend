const NotFoundError = require('./NotFoundError');
const BadRequestError = require('./BadRequestError');
const UnauthorizedError = require('./UnauthorizedError');
//================================================
function errorHandler(err, req, res, next) {
    if (err instanceof NotFoundError) {
        return res.status(404).json({
            message: err.message ? err.message : "NoutFound",
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof BadRequestError) {
        return res.status(400).json({
            message: err.message ? err.message : "BadRequest",
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    if (err instanceof UnauthorizedError) {
        return res.status(401).json({
            message: err.message ? err.message : "Unauthorized",
            errors: err.errors ? err.errors : [],
            data: []
        });
    }

    console.log(err);
    return res.status(500).json({
        message: "Server Error :)",
        errors: [],
        data: []
    });

}

module.exports = errorHandler;