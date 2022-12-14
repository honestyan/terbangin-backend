const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/document');
    },

    // generete unique filename
    filename: (req, file, callback) => {
        const namaFile = Date.now() + path.extname(file.originalname);
        filename = namaFile;
        callback(null, namaFile);
    }
});


module.exports = {
    document: multer({
        storage: storage,
        fileFilter: (req, file, callback) => {
            console.log("ini dari multer : ".file)
            console.log(file.mimetype)
            if (file.mimetype == 'application/pdf' ) {
                console.log(file)
                callback(null, true);
            } else {
                const err = new Error('only pdf allowed to upload!');
                return callback(err, false);
            }
        },

        // error handling
        onError: (err, next) => {
            next(err);
        }
    })

};