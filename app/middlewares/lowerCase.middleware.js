async function toLowerCase(req, res, next) {
    try {
        if (req.body.username != undefined) req.body.username = req.body.username.toLowerCase();
        if (req.body.firstname != undefined && req.body.lastname != undefined) req.body.fullname = req.body.firstname + ' ' + req.body.lastname;
        if (req.body.name != undefined) req.body.name_lower = req.body.name.toLowerCase();

        next();
    } catch (err) {
        next(err);
    }
}




export { toLowerCase }