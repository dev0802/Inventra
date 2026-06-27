const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

router.get('/consolidated', verifyToken, reportController.getConsolidatedReport);
router.get('/sales', verifyToken, reportController.getSalesReport);

module.exports = router;