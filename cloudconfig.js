const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
//backend is connecting with cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});

//in cloudinary ac we are getting floder name as wanderlust_DEV and it can accept all those mentioned formats
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpg","jpeg"],
  },
});
module.exports={
    cloudinary,
    storage,
}