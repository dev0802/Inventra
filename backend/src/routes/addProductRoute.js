// Route for adding a new product to the inventory
const addProductController = require('../controllers/addProductController');
const express = require('express');
const router = express.Router();

router.post('/add-product', addProductController.addProduct);

module.exports = router;