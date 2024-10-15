const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Load environment variables from .env if not in production
if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Set up CloudinaryStorage using multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',  // Folder name in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'],  // Allowed file formats
  },
});

// Initialize multer with the Cloudinary storage configuration
const upload = multer({ storage });
  
// Export the Cloudinary configuration and multer upload middleware
module.exports = {
  cloudinary,
  upload
};
