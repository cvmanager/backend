const multer = require('multer');
const mkdir = require('mkdirp');
const BadRequestError = require('../exceptions/BadRequestError');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdir('./public/profile/')
            .then((result) => {
                cb(null, './public/profile/')
            })
    },
    filename: (req, file, cb) => {
        let suffix = file.originalname.split('.');
        const imageName = req.user_id + '.' + suffix[1];
        cb(null, imageName);
        req.body.avatar = imageName;
    }
})

const maxSize = 0.1 ; //1mb
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            cb(null, false);
            return cb(new BadRequestError('Only .jpg .png format image'));
        }
        cb(null, true);
    },
    limits: { fileSize: maxSize }
})

module.exports = upload;