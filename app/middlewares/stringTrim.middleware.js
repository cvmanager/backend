async function stringTrim(req, res, next) {
    try {
        if (req.method === 'POST') {
            let body =  req.body;
            for (const key in body) {
                if (typeof body[key] === "object" || Array.isArray(body[key])) {
                    trim(body[key]);
                } else if (typeof body[key] === 'string') {
                    body[key] = body[key].trim();
                }
            }
        }
        next();
    } catch (err) {
        next(err);
    }
}



export default stringTrim