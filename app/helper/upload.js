import multer from 'multer';
import mkdirp from 'mkdirp';

import BadRequestError from '../exceptions/BadRequestError.js';

const createStorage = (destinationDir, fieldName, dupllicate) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            mkdirp(destinationDir)
                .then((result) => {
                    cb(null, destinationDir)
                })
        },
        filename: (req, file, cb) => {
            let suffix = file.originalname.split('.');

            let name = req.user_id;
            if (dupllicate == true) {
                const date = new Date();
                let time = date.getTime();
                name += '_' + time;
            }
            name += '.' + suffix[1];

            cb(null, name);
            req.body[fieldName] = destinationDir + name;
        }
    })
    return storage
}

const maxSize = 0.1; //1mb
const Upload = multer({
    storage: createStorage('./public/profile/', 'avatar', false),
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            cb(null, false);
            return cb(new BadRequestError('exceptions.valid_image_format'));
        }
        cb(null, true);
    },
    limits: { fileSize: maxSize }
})

const maxFileSize = 0.1; //1mb
const UploadFile = multer({
    storage: createStorage('./public/resume/file/', 'file', true),
    fileFilter: (req, file, cb) => {
        if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
            cb(null, false);
            return cb(new BadRequestError('exceptions.valid_file_format'));
        }
        cb(null, true);
    },
    limits: { fileSize: maxFileSize }
})


const maxLogoSize = 0.1; //1mb
const UploadLogo = multer({
    storage: createStorage('./public/company/logo/', 'logo', false),
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            cb(null, false);
            return cb(new BadRequestError('exceptions.valid_image_format'));
        }
        cb(null, true);
    },
    limits: { fileSize: maxLogoSize }
})


export { Upload, UploadFile, UploadLogo };