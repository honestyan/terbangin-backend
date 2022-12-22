
var ImageKit = require("imagekit");

const {
    IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVAT_KEY,
    IMAGEKIT_URL_ENDPOINT
}=process.env;


const imagekit = new ImageKit ({
    publicKey :IMAGEKIT_PUBLIC_KEY,
    privateKey :IMAGEKIT_PRIVAT_KEY,
    urlEndpoint : IMAGEKIT_URL_ENDPOINT
    }
);

module.exports = imagekit;