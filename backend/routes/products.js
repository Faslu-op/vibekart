const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { upload, isCloudinaryConfigured } = require('../config/cloudinary');

// GET all products (with optional category filter)
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const products = await Product.find(filter).sort('name').lean();
        res.send(products);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// POST add product with image upload (Admin only)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
    try {
        console.log('📝 Request body:', req.body);
        console.log('📁 Files received:', req.files ? req.files.length : 0);
        
        const { name, sellingPrice, description, category, originalPrice } = req.body;
        
        // Validate files
        
        let images = [];
        
        if (isCloudinaryConfigured) {
            console.log('☁️ Using Cloudinary storage');
            // Get uploaded image URLs from Cloudinary
            images = req.files.map(file => ({
                url: file.path
            }));
        } else {
            console.log('💾 Using base64 storage');
            // Convert to base64 for storage (fallback)
            images = req.files.map(file => {
                const base64 = file.buffer.toString('base64');
                return {
                    url: `data:${file.mimetype};base64,${base64}`
                };
            });
        }
        
        console.log('🖼️ Images to save:', images.length);
        
        let product = new Product({
            name,
            sellingPrice,
            originalPrice,
            description,
            category,
            images
        });
        product = await product.save();
        console.log('✅ Product saved successfully:', product._id);
        res.send(product);
    } catch (error) {
        console.error('❌ Error adding product:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Server Error: ' + error.message });
    }
});

// PUT update product with optional new images (Admin only)
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
    try {
        const { name, sellingPrice, description, category, originalPrice } = req.body;
        const updateData = { name, sellingPrice, originalPrice, description };
        
        // Update category if provided
        if (category) {
            updateData.category = category;
        }
        
        // If new images are uploaded, update them
        if (req.files && req.files.length > 0) {
            if (isCloudinaryConfigured) {
                updateData.images = req.files.map(file => ({
                    url: file.path
                }));
            } else {
                updateData.images = req.files.map(file => {
                    const base64 = file.buffer.toString('base64');
                    return {
                        url: `data:${file.mimetype};base64,${base64}`
                    };
                });
            }
        }
        
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Server Error: ' + error.message);
    }
});

// DELETE product (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('🗑️ Attempting to delete product:', req.params.id);
        
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.log('❌ Invalid Product ID format:', req.params.id);
            return res.status(400).send('Invalid Product ID format');
        }

        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            console.log('❌ Product not found for deletion');
            return res.status(404).send('Product not found');
        }
        console.log('✅ Product deleted successfully');
        res.send(product);
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        res.status(500).send('Server Error: ' + error.message);
    }
});

module.exports = router;
