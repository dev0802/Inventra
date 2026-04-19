// Route for adding a new product to the inventory
const addProductController = require('../controllers/addProductController');
const express = require('express');
const router = express.Router();

router.post('/add-product', addProductController.addProduct);
router.post('/add-item-description', addProductController.addItemDescription)
router.get('/get-item-descriptions', addProductController.getItemDescriptions);
router.delete('/delete-item-description', addProductController.deleteItemDescription);
module.exports = router;