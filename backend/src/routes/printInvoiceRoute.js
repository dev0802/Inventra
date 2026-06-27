const printInvoiceController = require('../controllers/printInvoiceController');
const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/customer-detail', verifyToken, printInvoiceController.customerDetail);
router.get('/customer-by-phone', verifyToken, printInvoiceController.getCustomerByPhone);
router.put('/update-customer-detail', verifyToken, printInvoiceController.updateCustomerDetail);
router.get('/product-by-item-code', verifyToken, printInvoiceController.getProductByItemCode);
router.post('/save-item-detail', verifyToken, printInvoiceController.saveItemDetail);
router.post('/save-invoice', verifyToken, printInvoiceController.saveInvoice);
router.get('/get-invoice/:invoice_id', verifyToken, printInvoiceController.getInvoiceById);
router.get('/get-invoice-by-fy/:financialYear', verifyToken, printInvoiceController.getInvoiceByFY);
router.get('/get-by-number', verifyToken, printInvoiceController.getInvoiceByNumberAndFY);
router.put('/update/:invoice_number', verifyToken, printInvoiceController.updateInvoice);
router.delete('/delete/:invoice_id', verifyToken, printInvoiceController.deleteInvoice);
router.post('/general-invoice', verifyToken, printInvoiceController.generateInvoice);
module.exports = router;