// upload.middleware.js
const path = require("path");
const apiError = require("../utils/apiError");
const multer = require("multer");

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".mp4"];

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.includes(ext)) return cb(null, true);
  cb(apiError(400, "Only jpeg, png, webp or mp4 files are allowed"));
};

const createUploader = ({ maxSizeMb = 2 } = {}) =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: maxSizeMb * 1024 * 1024 },
  });

const upload = createUploader({ maxSizeMb: 5 });
const uploadMedia = createUploader({ maxSizeMb: 10 });

module.exports = { upload, uploadMedia, createUploader };









// const apiError = require("../utils/apiError");
// const multer = require("multer")

// const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp','image/jpg'];
// const VIDEO_TYPES = ['video/mp4'];

// /**
//  * memoryStorage, NOT diskStorage.
//  *
//  * Render, Railway and Vercel all give you an EPHEMERAL disk: it is wiped on
//  * every restart and every deploy. A file written to ./uploads works perfectly
//  * on your laptop and vanishes in production. So we keep the file in a Buffer
//  * just long enough to stream it to Cloudinary.
//  */
// const fileFilter = (_req, file, cb) => {

//   console.log("line 17 filter file",file);
//   if ([...IMAGE_TYPES, ...VIDEO_TYPES].includes(file.mimetype)) return cb(null, true);
//   cb(apiError(400, 'Only jpeg, png, webp or mp4 files are allowed'));
// };

// /**
//  * A FACTORY, so different routes can have different limits.
//  * The limit is not politeness - without it, one request can put a 500 MB
//  * buffer in your process memory.
//  */
//  const createUploader = ({ maxSizeMb = 2 } = {}) =>
//   multer({
//     storage: multer.memoryStorage(),
//     fileFilter,
//     limits: { fileSize: maxSizeMb * 1024 * 1024 },
//   });

// // Categories, brands, banners, return photos: one small image.
//  const upload = createUploader({ maxSizeMb: 5 });

// // Products: up to five images plus a short clip, so a bigger ceiling.
//  const uploadMedia = createUploader({ maxSizeMb: 10 });

// /* Usage:
//      upload.single('image')                              -> req.file
//      uploadMedia.fields([{ name:'images', maxCount:5 },
//                          { name:'video',  maxCount:1 }]) -> req.files.images / req.files.video

//    IMPORTANT: the upload middleware must run BEFORE validate(), because until
//    multer has parsed the multipart body, req.body is empty.                */
// module.exports = {upload,uploadMedia,createUploader }