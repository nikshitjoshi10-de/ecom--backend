const { fileTypeFromBuffer } = require("file-type");

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const verifyImageType = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "userLogo image is required" });
    }

    const detected = await fileTypeFromBuffer(req.file.buffer);

    if (!detected || !allowedTypes.includes(detected.mime)) {
      return res.status(400).json({
        success: false,
        message: "Only JPG, PNG and WEBP files are allowed",
      });
    }

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "File verification failed" });
  }
};

module.exports = verifyImageType;