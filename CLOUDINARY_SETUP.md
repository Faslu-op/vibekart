# Cloudinary Setup Guide

## Step 1: Create a Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account (no credit card required)
3. Verify your email

## Step 2: Get Your Credentials

1. After logging in, go to your **Dashboard**
2. You'll see your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 3: Update Your `.env` File

Open `backend/.env` and replace the placeholder values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce_modern
JWT_SECRET=supersecretkey123
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## Step 4: Restart the Backend Server

```bash
cd backend
npm run dev
```

## Features Implemented

✅ **Multiple Image Upload** - Upload up to 5 images per product
✅ **Image Preview** - See thumbnails before uploading
✅ **Cloudinary Storage** - Images are automatically optimized and stored
✅ **Remove Images** - Delete unwanted images before submitting

## How to Use

1. Login to Admin Dashboard (`/admin/login`)
2. Click "Add Product"
3. Fill in product details
4. Click the upload box to select images (or drag & drop)
5. Preview your images
6. Remove any unwanted images using the X button
7. Submit the form

Your images will be automatically uploaded to Cloudinary and the URLs will be saved in MongoDB!

## Free Tier Limits

Cloudinary free tier includes:
- 25 GB storage
- 25 GB bandwidth/month
- Perfect for development and small projects
