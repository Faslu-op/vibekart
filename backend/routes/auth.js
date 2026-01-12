const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('Invalid username or password.');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid username or password.');

        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Register (One-time use or protected, for now allow creating admin manually or via a secret endpoint)
// For simplicity, we can have a seed script or a temp register route
router.post('/register-admin', async (req, res) => {
    try {
        let user = await User.findOne({ username: req.body.username });
        if (user) return res.status(400).send('User already exists');

        user = new User({
            username: req.body.username,
            password: req.body.password,
            isAdmin: true
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        res.send({ message: "Admin registered" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;
