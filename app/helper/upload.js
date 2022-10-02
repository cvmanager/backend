const multer = require('multer');
const mkdir = require('mkdirp');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdir('./public/profile/')
            .then((result) => {
                cb(null, './public/profile/')
            })
    },
    filename: function (req, file, cb) {
        const { originalname } = file
        const userId = req.params.id
        let suffix = originalname.split('.')
        suffix = suffix.at(-1)
        const imageName = userId + '.' + suffix
        cb(null, imageName)
        req.body.image_name = imageName
    }
})

const upload = multer({ storage: storage })

module.exports = upload;