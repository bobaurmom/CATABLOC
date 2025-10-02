//# Main application entry point (app server setup)
// /backend/index.js

// Import dependencies
const express = require('express');
const dotenv = require('dotenv'); // Loads environment variables from .env file
const routes = require('./routes'); // Import your API routes

// Load environment variables
dotenv.config();

// Create an instance of the Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Mount routes
app.use('/api', routes); // All API endpoints will start with /api

// Error handling middleware (catch-all)
// 'req' and 'next' are required by Express error middleware signature
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});