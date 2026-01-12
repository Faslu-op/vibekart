const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_modern')
.then(async () => {
    console.log('MongoDB Connected for Seeding');

    // Seed Admin
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        const admin = new User({
            username: 'admin',
            password: hashedPassword,
            isAdmin: true
        });
        await admin.save();
        console.log('Admin created: username=admin, password=admin123');
    } else {
        console.log('Admin already exists');
    }

    // Seed Sample Product
    const productExists = await Product.findOne({ name: 'Minimalist Leather Watch' });
    if (!productExists) {
        const product = new Product({
            name: 'Minimalist Leather Watch',
            price: 129,
            description: 'A premium minimalist watch featuring a genuine leather strap and a sapphire crystal glass. Water-resistant and elegant for any occasion.',
            images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80']
        });
        await product.save();
        console.log('Sample Product created');
    }
    
    // Seed Another Product
    const product2Exists = await Product.findOne({ name: 'Noise-Cancelling Headphones' });
    if(!product2Exists) {
        const product2 = new Product({
            name: 'Noise-Cancelling Headphones',
            price: 299,
            description: 'Experience pure silence with our top-tier noise-cancelling headphones. 30-hour battery life and supreme comfort.',
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80']
        });
        await product2.save();
        console.log('Sample Product 2 created');
    }

    process.exit();
})
.catch(err => {
    console.log(err);
    process.exit(1);
});
