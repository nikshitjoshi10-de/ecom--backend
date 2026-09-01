const apiError = require("./apiError");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const ALLOWED_REAL_TYPES = ["jpg", "jpeg", "png", "webp", "mp4"];

const uploadToCloudinary = async (buffer, folder, resourceType = "image") => {
  // file-type sniffs the actual magic bytes - this is what can't be spoofed
  const { fileTypeFromBuffer } = await import("file-type");
  const detected = await fileTypeFromBuffer(buffer);

  if (!detected || !ALLOWED_REAL_TYPES.includes(detected.ext)) {
    throw apiError(400, "Only jpeg, png, webp or mp4 files are allowed");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) =>
        error
          ? reject(apiError(500, "Image upload failed. Please try again."))
          : resolve({ url: result.secure_url, publicId: result.public_id }),
    );
    stream.end(buffer);
  });
};

const destroyFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId ) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { uploadToCloudinary, destroyFromCloudinary };












// const apiError = require("./apiError");
// const {cloudinary,isCloudinaryConfigured} = require("../config/cloudinary");

//  const uploadToCloudinary = (buffer, folder, resourceType = 'image') =>
//   new Promise((resolve, reject) => {
    

//     const stream = cloudinary.uploader.upload_stream(
//       { folder, resource_type: resourceType },
//       (error, result) =>
//         error
//           ? reject(apiError(500, 'Image upload failed. Please try again.'))
//           : resolve({ url: result.secure_url, publicId: result.public_id }),
//     );

//     stream.end(buffer);
//   });

//  const destroyFromCloudinary = async (publicId, resourceType = 'image') => {
//   if (!publicId || !isCloudinaryConfigured()) return;
//   try {
//     await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
//   } catch(err) {
//       console.log(err)
//   }
// };

// module.exports= {uploadToCloudinary,destroyFromCloudinary}
