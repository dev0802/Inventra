const printInvoiceController = require('../controllers/printInvoiceController');
const express = require('express');
const router = express.Router();

router.post('/customer-detail', printInvoiceController.customerDetail);
router.get('/customer-by-phone', printInvoiceController.getCustomerByPhone);
router.put('/update-customer-detail', printInvoiceController.updateCustomerDetail);
router.get('/product-by-item-code', printInvoiceController.getProductByItemCode);
router.post('/save-item-detail', printInvoiceController.saveItemDetail);
router.post('/save-invoice', printInvoiceController.saveInvoice);
router.get('/get-invoice/:invoice_id', printInvoiceController.getInvoiceById);
router.get('/get-invoice-by-fy/:financialYear', printInvoiceController.getInvoiceByFY);
router.get('/get-by-number', printInvoiceController.getInvoiceByNumberAndFY);
router.put('/update/:invoice_id', printInvoiceController.updateInvoice);
router.delete('/delete/:invoice_id', printInvoiceController.deleteInvoice);
router.post('/general-invoice', printInvoiceController.generateInvoice);
module.exports = router;