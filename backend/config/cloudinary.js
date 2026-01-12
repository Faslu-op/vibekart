const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Check if Cloudinary is configured
const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

let upload;

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'ecommerce_products',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        }
    });

    upload = multer({ storage: storage });
    console.log('✅ Cloudinary configured successfully');
} else {
    // Fallback: Use memory storage (images will be base64 encoded)
    const storage = multer.memoryStorage();
    upload = multer({ 
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
    });
    console.log('⚠️  Cloudinary not configured. Using memory storage.');
}

module.exports = { cloudinary, upload, isCloudinaryConfigured };
