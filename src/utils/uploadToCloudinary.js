const apiError = require("./apiError");
const {cloudinary,isCloudinaryConfigured} = require("../config/cloudinary");

 const uploadToCloudinary = (buffer, folder, resourceType = 'image') =>
  new Promise((resolve, reject) => {
    

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) =>
        error
          ? reject(apiError(500, 'Image upload failed. Please try again.'))
          : resolve({ url: result.secure_url, publicId: result.public_id }),
    );

    stream.end(buffer);
  });

 const destroyFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch(err) {
      console.log(err)
  }
};

module.exports= {uploadToCloudinary,destroyFromCloudinary}