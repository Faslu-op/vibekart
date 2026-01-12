const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// GET all categories sorted by orderIndex
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort('orderIndex');
        res.send(categories);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// POST sync categories from products (Admin only)
router.post('/sync', auth, async (req, res) => {
    try {
        const productCategories = await Product.distinct('category');
        
        for (const catName of productCategories) {
            if (!catName) continue;
            
            // Check if exists
            const existing = await Category.findOne({ name: catName });
            if (!existing) {
                // Get next order index
                const count = await Category.countDocuments();
                await new Category({ name: catName, orderIndex: count }).save();
            }
        }
        
        const allCategories = await Category.find().sort('orderIndex');
        res.send(allCategories);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// PUT reorder categories (Admin only)
router.put('/reorder', auth, async (req, res) => {
    try {
        const { categories } = req.body; // Array of { id, orderIndex }
        
        for (const item of categories) {
            await Category.findByIdAndUpdate(item.id, { orderIndex: item.orderIndex });
        }
        
        const updated = await Category.find().sort('orderIndex');
        res.send(updated);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
