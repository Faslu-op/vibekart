# 🛍️ Modern E-commerce Platform

A beautiful, minimal, and premium e-commerce website with one-click buying experience.

## ✨ Features

### Customer Experience
- 🏠 **Beautiful Home Page** - Premium product grid with smooth animations
- 📦 **Product Details** - High-quality image gallery with elegant layout
- 🚀 **One-Click Buying** - No cart, no signup - just buy!
- ✅ **Instant Confirmation** - Clean success page after purchase

### Admin Panel
- 🔐 **Secure Login** - JWT-based authentication
- 📸 **Cloudinary Image Upload** - Upload multiple product images (up to 5)
- ✏️ **Product Management** - Add, edit, and delete products
- 📊 **Order Management** - View all customer orders with details

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- React Router
- Axios
- Lucide Icons
- Vanilla CSS (Premium Design)

**Backend:**
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Image Storage)
- Multer (File Upload)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Cloudinary account (free)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup Environment Variables

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce_modern
JWT_SECRET=supersecretkey123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Get Cloudinary credentials:** See [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)

### 3. Seed Database

```bash
cd backend
node seed.js
```

This creates:
- Admin user: `admin` / `admin123`
- 2 sample products

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on: http://localhost:5173

## 📖 Usage

### Customer Flow
1. Browse products on home page
2. Click a product to view details
3. Select quantity
4. Click "Buy Now"
5. Enter shipping details
6. Get instant confirmation

### Admin Flow
1. Click lock icon or go to `/admin/login`
2. Login with: `admin` / `admin123`
3. **Add Products:**
   - Click "Add Product"
   - Fill in details
   - Upload images (drag & drop or click)
   - Preview and remove unwanted images
   - Submit
4. **View Orders:**
   - Switch to "Orders" tab
   - See all customer orders with details

## 📁 Project Structure

```
prefit/
├── backend/
│   ├── config/
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── models/
│   │   ├── Product.js          # Product schema
│   │   ├── Order.js            # Order schema
│   │   └── User.js             # User/Admin schema
│   ├── routes/
│   │   ├── products.js         # Product CRUD + image upload
│   │   ├── orders.js           # Order management
│   │   └── auth.js             # Admin authentication
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   ├── server.js               # Express server
│   ├── seed.js                 # Database seeder
│   └── .env                    # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx      # Navigation bar
    │   │   ├── Button.jsx      # Reusable button
    │   │   └── Input.jsx       # Reusable input
    │   ├── pages/
    │   │   ├── Home.jsx        # Product listing
    │   │   ├── ProductDetail.jsx
    │   │   ├── Address.jsx     # Shipping form
    │   │   ├── OrderConfirmation.jsx
    │   │   ├── AdminLogin.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── services/
    │   │   └── api.js          # API client
    │   ├── styles/
    │   │   └── main.css        # Global styles
    │   ├── App.jsx             # Routes
    │   └── main.jsx            # Entry point
    └── package.json
```

## 🎨 Design Philosophy

- **Minimal & Clean** - No clutter, focus on products
- **Premium Feel** - Soft shadows, smooth transitions
- **Mobile-First** - Responsive on all devices
- **Fast & Smooth** - Optimized animations and loading

## 🔒 Security Features

- JWT token authentication
- Protected admin routes
- Secure password hashing (bcrypt)
- Environment variable protection

## 📝 API Endpoints

### Public
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/orders` - Create order

### Admin (Requires Token)
- `POST /api/auth/login` - Admin login
- `POST /api/products` - Add product (with image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/orders` - Get all orders

## 🌟 Key Features Explained

### Image Upload System
- **Multiple Files:** Upload up to 5 images per product
- **Preview:** See thumbnails before uploading
- **Cloudinary:** Automatic optimization and CDN delivery
- **Remove:** Delete unwanted images before submission

### One-Click Buying
- No cart complexity
- Direct product → address → confirmation flow
- Single product purchase at a time
- Streamlined checkout experience

## 📚 Additional Resources

- [MongoDB Setup Guide](./MONGODB_SETUP.md)
- [Cloudinary Setup Guide](./CLOUDINARY_SETUP.md)

## 🐛 Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify `.env` file exists and has correct values

**Images not uploading:**
- Verify Cloudinary credentials in `.env`
- Check file size (max 10MB recommended)
- Ensure file format is supported (jpg, png, webp)

**Can't login to admin:**
- Run `node seed.js` to create admin user
- Use credentials: `admin` / `admin123`

## 📄 License

MIT License - Feel free to use for personal or commercial projects!

## 🙏 Credits

Built with ❤️ using modern web technologies.
