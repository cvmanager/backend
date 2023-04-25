
async function fillFullName(req, res, next) {
    try {
        if (req.body.firstname != undefined) req.body.firstname = req.body.firstname.toLowerCase();
        if (req.body.lastname != undefined) req.body.lastname = req.body.lastname.toLowerCase();
        if (req.body.firstname != undefined && req.body.lastname != undefined) req.body.fullname = req.body.firstname + ' ' + req.body.lastname;
        next();
    } catch (err) {
        next(err);
    }
}

async function convertCompanyFieldToLowerCase(req, res, next) {
    try {
        if (req.body.name != undefined) req.body.name = req.body.name.toLowerCase();
        next();
    } catch (err) {
        next(err);
    }
}

async function convertProjectFieldToLowerCase(req, res, next) {
    try {
        if (req.body.name != undefined) req.body.name = req.body.name.toLowerCase();
        next();
    } catch (err) {
        next(err);
    }
}


export { fillFullName, convertCompanyFieldToLowerCase, convertProjectFieldToLowerCase }