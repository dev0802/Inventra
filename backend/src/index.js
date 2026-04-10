// Main entry point for the Express server
const express = require('express');
const cors = require('cors');
const app = express();
// Import routes for authentication and product management
const authRoute = require('./routes/authRoute');
const addProductRoute = require('./routes/addProductRoute');
// Middleware for parsing JSON and handling CORS
app.use(express.json());
app.use(cors());
// Use the imported routes for handling API requests
app.use('/api/auth/', authRoute);
app.use('/api/product/', addProductRoute);
// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});