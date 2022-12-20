const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/document");
  },

  filename: (req, file, callback) => {
    const namaFile = Date.now() + path.extname(file.originalname);
    filename = namaFile;
    callback(null, namaFile);
  },
});

module.exports = {
  deleteFile: (filename) => {
    fs.unlink(`./public/document/${filename}`, (err) => {
      if (err) {
        next(err);
      }
    });
  },
  document: multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
      if (file.mimetype == "application/pdf") {
        callback(null, true);
      } else {
        const err = new Error("only pdf allowed to upload!");
        return callback(err, false);
      }
    },
    // error handling
    onError: (err, next) => {
      next(err);
    },
  }),
};
