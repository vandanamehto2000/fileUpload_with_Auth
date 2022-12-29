const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "content")
    },
    fileName: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 100000 * 100 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpg | png | mp4 | mkv | flv | mov | wmv | gif/;
        console.log("file", file.mimeType, "qqqqqqqqqqqqqqqqqq",file.originalname)
        // const mimeType = fileTypes.test(file.mimeType);
        // const extname = fileTypes.test(path.extname(file.originalname));

        // if (mimeType && extname) {
        //     return cb(null, true);
        // }
        // cb("only images supported");
        return cb(null, true);
    }
})
    .single("content");

module.exports = upload;