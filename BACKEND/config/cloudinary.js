const cloudinary = require('cloudinary').v2;

// Debug logs (remove after fixing)
console.log('Cloudinary Config Debug:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Loaded' : 'MISSING');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Loaded' : 'MISSING');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'MISSING');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;