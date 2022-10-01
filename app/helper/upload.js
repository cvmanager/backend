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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

module.exports = upload;