// now image uploaded in cloudinary
const cloudinary = require("cloudinary").v2;

/**
 * @param {Object} file - File object from express-fileupload (with tempFilePath)
 * @param {string} folderName - Cloudinary folder name
 * @param {number} [quality] - Optional image quality
 * @param {number} [height] - Optional image height
 */
exports.uploadImageAtCloudinary = async (file, folderName, quality, height) => {
  try {
    if (!file) {
      throw new Error("Upload failed: no file received");
    }
    const filePath = file.tempFilePath || file.tempfilePath;
    if (!filePath) {
      throw new Error("Upload failed: file has no tempFilePath (check express-fileupload useTempFiles)");
    }

    const folder = folderName || process.env.FOLDER_NAME || "course_thumbnails";
    const options = { folder, resource_type: "auto" };
    if (height) options.height = height;
    if (quality) options.quality = quality;

    const result = await cloudinary.uploader.upload(filePath, options);
    return result;
  } catch (err) {
    console.error("Cloudinary upload error:", err?.message || err);
    throw err;
  }
};


