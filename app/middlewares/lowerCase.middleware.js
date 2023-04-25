
async function fillFullName(req, res, next) {
    try {
        if(req.body.firstname != undefined) req.body.firstname  = req.body.firstname.toLowerCase();
        if(req.body.lastname != undefined) req.body.lastname  = req.body.lastname.toLowerCase();
        if(req.body.firstname != undefined && req.body.lastname != undefined) req.body.fullname = req.body.firstname + ' ' + req.body.lastname;
        next();
    } catch (err) {
        next(err);
    }
}

export { fillFullName }