const express = require('express');
const router = express.Router();
const viewProductController = require('../controllers/viewProductController');

router.put('/update', viewProductController.updateProductDetails);
router.post('/filter', viewProductController.filterProducts);
router.get('/all', viewProductController.getAllProducts);

module.exports = router;