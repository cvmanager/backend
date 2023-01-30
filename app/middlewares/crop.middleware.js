import sharp from "sharp";
import * as fs from 'fs'
import BadRequestError from "../exceptions/BadRequestError.js";
/**
 * crops req.file image
 * @param { [number] } sizeList[]
 */
export default function cropImage(sizeList) {
    return async (req, res, next) => {
        let file = req.file
        if (!file) throw new BadRequestError('system.errors.no_file')
        
        try {
            for(const size of sizeList) {
                let croppedFilePath = file.path.replace("org", size)
                fs.mkdir(croppedFilePath.replace(file.filename, ''), { recursive: true }, async (error) => {
                    if (error) throw error

                    await sharp(file.path).resize(size, null, { fit: 'fill' }).toFile(croppedFilePath)
                });
            }
        } catch (error) {
            next(new BadRequestError("system.errors.crop_file", [error]))
        }

        return next()
    }
}