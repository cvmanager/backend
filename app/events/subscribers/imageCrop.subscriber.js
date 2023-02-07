import EventEmitter from '../emitter.js';
import sharp from "sharp";
import * as fs from 'fs';

export const cropEvents = {
    "Crop_Image": "Crop Image"
}

EventEmitter.on(cropEvents.Crop_Image, cropImage)

function cropImage(file, sizeList) {
    try {
        for(const size of sizeList) {
            let croppedFilePath = file.path.replace("org", size)
            fs.mkdir(croppedFilePath.replace(file.filename, ''), { recursive: true }, async (error) => {
                if (error) throw error

                await sharp(file.path).resize(size, size, { fit: 'fill' }).toFile(croppedFilePath)
            });
        }
    } catch (error) {
        new BadRequestError("system.errors.crop_file", [error])
    }
}