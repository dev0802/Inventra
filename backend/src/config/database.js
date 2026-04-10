//database connection file for admin and product details tables
const {Pool} = require('pg');
require('dotenv').config();
// Create a connection pool for admin table
const adminPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
// Create a connection pool for productdetail table
const productDetailPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});
// Export the connection pools for use in other modules
module.exports = {
  adminPool,
  productDetailPool
};