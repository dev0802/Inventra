const printIncoiceController = require('../controllers/printInvoiceController');
const express = require('express');
const router = express.Router();

router.post('/customer-detail', printIncoiceController.customerDetail);
router.get('/customer-by-phone', printIncoiceController.getCustomerByPhone);
router.put('/update-customer-detail', printIncoiceController.updateCustomerDetail);
router.get('/product-by-item-code', printIncoiceController.getProductByItemCode);
router.post('/save-item-detail', printIncoiceController.saveItemDetail);

module.exports = router;