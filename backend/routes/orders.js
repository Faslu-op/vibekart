const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// POST create order (Public)
router.post('/', async (req, res) => {
    try {
        const { customer, items, totalAmount } = req.body;
        // In a real app we would validate prices here again
        let order = new Order({
            customer,
            items,
            totalAmount
        });
        order = await order.save();
        res.send(order);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// GET all orders (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product').sort('-createdAt');
        res.send(orders);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// PUT update order status (Admin only)
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        ).populate('items.product');
        if (!order) return res.status(404).send('Order not found');
        res.send(order);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// DELETE order (Admin only) - Only completed orders can be deleted
router.delete('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).send('Order not found');
        
        if (order.status !== 'Completed') {
            return res.status(400).send('Only completed orders can be deleted');
        }

        await Order.findByIdAndDelete(req.params.id);
        res.send({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
