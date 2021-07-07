const multer = require('multer');
const uuid = require('uuid').v4;

module.exports = function () {
    const imgStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/images');
        },
        filename: (req, file, cb) => {
            const {originalname} = file;
            cb(null, `${uuid()}-${originalname}`);
        }
    });

    return multer({storage: imgStorage});
};