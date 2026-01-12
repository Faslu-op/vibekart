# MongoDB Setup Guide

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows Installation:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows Service automatically
4. Verify installation: `mongod --version`

### Start MongoDB (if not running):
```bash
# Windows (if installed as service)
net start MongoDB

# Or run manually
mongod --dbpath="C:\data\db"
```

## Option 2: Use MongoDB Atlas (Free Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0)
4. Get your connection string
5. Update `.env` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_modern
   ```

## After MongoDB is Running:

1. **Seed the database:**
   ```bash
   cd d:/prefit/backend
   node seed.js
   ```

2. **Start the backend:**
   ```bash
   npm run dev
   ```

3. **Admin Login Credentials:**
   - Username: `admin`
   - Password: `admin123`

## Quick Test:
Once MongoDB is running, the backend should show:
```
Server started on port 5000
MongoDB Connected
```
