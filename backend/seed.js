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
    const fasluUsername = 'Faslu';
    const fasluPassword = 'Faslu@710';
    
    let admin = await User.findOne({ username: fasluUsername });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(fasluPassword, salt);

    if (!admin) {
        admin = new User({
            username: fasluUsername,
            password: hashedPassword,
            isAdmin: true
        });
        await admin.save();
        console.log(`Admin created: username=${fasluUsername}, password=${fasluPassword}`);
    } else {
        admin.password = hashedPassword;
        await admin.save();
        console.log(`Admin credentials updated for: ${fasluUsername}`);
    }

   

    process.exit();
})
.catch(err => {
    console.log(err);
    process.exit(1);
});
