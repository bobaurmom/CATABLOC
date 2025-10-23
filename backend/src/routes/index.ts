// combine all routes
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');

// Import your route modules here
// const userRoutes = require('./users');

// Mount route modules
// router.use('/users', userRoutes);

module.exports = router;
