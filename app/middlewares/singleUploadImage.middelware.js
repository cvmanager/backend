


function setImageFiled(req, res, next) {
    console.log('mid upliad', req.body.image);

    req.body.image = 'd';

    console.log('end mid upliad',req.body.image);
    next();
}


module.exports = { setImageFiled }