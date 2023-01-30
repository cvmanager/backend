import multer from 'multer';
import path from 'path';
import fs from 'fs';

import BadRequestError from '../exceptions/BadRequestError.js';

const config = {
    'image': {
        types: ['image/jpeg', 'image/jpg', 'image/png'],
        maxSize: 0.6 * 1_000_000, // 1_000_000 Bytes = 1 MB
    },
    'file': {
        types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        maxSize: 0.1 * 1_000_000, // 1_000_000 Bytes = 1 MB
    }
}

const createStorage = (entity, fieldName) => {
    let basePath = './public';
    let realPath = `/uploads/${entity}/`;
    let fullPath = basePath + realPath;

    return multer.diskStorage({
        destination: fullPath,
        filename: (req, file, cb) => {
            let extension = path.extname(file.originalname);
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
                return cb(new BadRequestError(`exceptions.valid_${type}_format`));
            }
            cb(null, true);
        },
        limits: { fileSize: fileConfig.maxSize }
    }).single(field)
}


export { Upload };