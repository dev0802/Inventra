const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const viewProductController = require('../controllers/viewProductController');

router.put('/update', verifyToken, viewProductController.updateProductDetails);
router.post('/filter', verifyToken, viewProductController.filterProducts);
router.get('/all', verifyToken, viewProductController.getAllProducts);

module.exports = router;