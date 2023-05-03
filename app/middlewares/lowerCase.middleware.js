async function toLowerCase(req, res, next) {
    try {
        if (req.body.firstname != undefined) req.body.firstname = req.body.firstname.toLowerCase();
        if (req.body.lastname != undefined) req.body.lastname = req.body.lastname.toLowerCase();
        if (req.body.firstname != undefined && req.body.lastname != undefined) req.body.fullname = req.body.firstname + ' ' + req.body.lastname;
        if (req.body.name != undefined) req.body.name = req.body.name.toLowerCase();

        next();
    } catch (err) {
        next(err);
    }
}




export { toLowerCase }