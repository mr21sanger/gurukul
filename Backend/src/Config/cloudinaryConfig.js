const cloudinary = require("cloudinary").v2;
const fs = require("fs");


cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Api_Key,
  api_secret: process.env.Api_Secret, // Click 'View Credentials' below to copy your API secret
});

const uploadCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;
    const res = await cloudinary.uploader.upload(localPath, {
      resource_type: "image",
    });

    // Delete the file after successful upload
    if (res) {
      fs.unlinkSync(localPath);
    }

    return res;
  } catch (error) {
    fs.unlinkSync(localPath);
    console.log(error);
  }
};
module.exports = uploadCloudinary;