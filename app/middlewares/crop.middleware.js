import EventEmitter from "../events/emitter.js";

/**
 * crops req.file image
 * @param { [number] } sizeList[]
 */
export default function cropImage(sizeList, event) {
    return async (req, res, next) => {
        let file = req.file
        if (file) EventEmitter.emit(event, file, sizeList);

        return next()
    }
}