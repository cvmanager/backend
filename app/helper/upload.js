import multer from 'multer';
import mkdirp from 'mkdirp';
import fs from 'fs';
import BadRequestError from '../exceptions/BadRequestError.js';

const config = {
    'image': {
        types: ['image/jpeg', 'image/jpg', 'image/png'],
        maxSize: 0.6, //1mb
    },
    'file': {
        types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        maxSize: 0.1, //1mb
    }
}

const createStorage = (entity, fieldName) => {
    let basePath = './public';
    let realPath = `/uploads/${entity}/`;
    let fullPath = basePath + realPath;

    return multer.diskStorage({
        destination: function (req, file, cb) {
            mkdirp(fullPath)
                .then((result) => {
                    cb(null, fullPath)
                })
        },
        filename: (req, file, cb) => {
            let extension = '.' + file.originalname.split('.')[1];
            let name = req.user_id._id;

            if (fs.existsSync(fullPath + name + extension)) {
                const date = new Date();
                name = name + '_' + date.getTime();
            }
            name += extension;
            console.log(name)
            cb(null, name);
            req.body[fieldName] = realPath + name;
        }
    })
}
function Upload(entity, field, type) {
    let fileConfig = config[type];
    return multer({
        storage: createStorage(entity, field),
        fileFilter: (req, file, cb) => {
            if (!fileConfig.types.includes(file.mimetype)) {
                cb(null, false);
                return cb(new BadRequestError(`exceptions.valid_${type}_format`));
            }
            cb(null, true);
        },
        limits: { fileSize: fileConfig.maxSize }
    }).single(field)
}


export { Upload };