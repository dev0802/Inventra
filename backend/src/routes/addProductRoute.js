// Route for adding a new product to the inventory
const addProductController = require('../controllers/addProductController');
const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/add-product', verifyToken, addProductController.addProduct);
router.post('/add-item-description', verifyToken, addProductController.addItemDescription)
router.get('/get-item-descriptions', verifyToken, addProductController.getItemDescriptions);
router.delete('/delete-item-description', verifyToken, addProductController.deleteItemDescription);
module.exports = router;