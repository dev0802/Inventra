const reportService = require('../services/reportService');

exports.getConsolidatedReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        if (!fromDate || !toDate) {
            return res.status(400).json({ error: 'fromDate and toDate are required' });
        }

        const data = await reportService.getConsolidatedReport(fromDate, toDate);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};

exports.getSalesReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        if (!fromDate || !toDate) {
            return res.status(400).json({ error: 'fromDate and toDate are required' });
        }

        const data = await reportService.getSalesReport(fromDate, toDate);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Sales Report error:', error);
        res.status(500).json({ error: 'Failed to generate sales report' });
    }
};