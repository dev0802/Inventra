const printIncoiceController = require('../controllers/printInvoiceController');
const express = require('express');
const router = express.Router();

router.post('/customer-detail', printIncoiceController.customerDetail);
router.get('/customer-by-phone', printIncoiceController.getCustomerByPhone);
router.put('/update-customer-detail', printIncoiceController.updateCustomerDetail);
router.get('/product-by-item-code', printIncoiceController.getProductByItemCode);
router.post('/save-item-detail', printIncoiceController.saveItemDetail);
router.post('/save-invoice', printIncoiceController.saveInvoice);
router.get('/get-invoice/:invoice_id', printIncoiceController.getInvoiceById);
router.get('/get-invoice-by-fy/:financialYear', printIncoiceController.getInvoiceByFY);
router.get('/get-by-number', printIncoiceController.getInvoiceByNumberAndFY);
router.put('/update/:invoice_id', printIncoiceController.updateInvoice);
router.delete('/delete/:invoice_id', printIncoiceController.deleteInvoice);

module.exports = router;