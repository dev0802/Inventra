const logger = require("../utilis/loggerFile");
const reportService = require('../services/reportService');

exports.getConsolidatedReport = async (req, res) => {
    const { fromDate, toDate } = req.query;
    logger.info(`Get Consolidated Report attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | From: ${fromDate} | To: ${toDate}`)
    try {
        if (!fromDate || !toDate) {
            logger.error(`Consolidated Report failed | User Id: ${req.user.userId} & User: ${req.user.userName} | Missing fromDate or toDate`)
            return res.status(400).json({ error: 'fromDate and toDate are required' });
        }

        const data = await reportService.getConsolidatedReport(fromDate, toDate);
        logger.info(`Consolidated Report fetched successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | From: ${fromDate} | To: ${toDate}`)
        res.json({ success: true, data });
    } catch (error) {
        logger.error(`Consolidated Report error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`)
        res.status(500).json({ error: 'Failed to generate report' });
    }
};

exports.getSalesReport = async (req, res) => {
    const { fromDate, toDate } = req.query;
    logger.info(`Get Sales Report attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | From: ${fromDate} | To: ${toDate}`)
    try {
        if (!fromDate || !toDate) {
            logger.error(`Sales Report failed | User Id: ${req.user.userId} & User: ${req.user.userName} | Missing fromDate or toDate`)
            return res.status(400).json({ error: 'fromDate and toDate are required' });
        }

        const data = await reportService.getSalesReport(fromDate, toDate);
        logger.info(`Sales Report fetched successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | From: ${fromDate} | To: ${toDate}`)
        res.json({ success: true, data });
    } catch (error) {
        logger.error(`Sales Report error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`)
        res.status(500).json({ error: 'Failed to generate sales report' });
    }
};
// const reportService = require('../services/reportService');

// exports.getConsolidatedReport = async (req, res) => {
//     try {
//         const { fromDate, toDate } = req.query;

//         if (!fromDate || !toDate) {
//             return res.status(400).json({ error: 'fromDate and toDate are required' });
//         }

//         const data = await reportService.getConsolidatedReport(fromDate, toDate);
//         res.json({ success: true, data });
//     } catch (error) {
//         console.error('Report error:', error);
//         res.status(500).json({ error: 'Failed to generate report' });
//     }
// };

// exports.getSalesReport = async (req, res) => {
//     try {
//         const { fromDate, toDate } = req.query;
//         if (!fromDate || !toDate) {
//             return res.status(400).json({ error: 'fromDate and toDate are required' });
//         }

//         const data = await reportService.getSalesReport(fromDate, toDate);
//         res.json({ success: true, data });
//     } catch (error) {
//         console.error('Sales Report error:', error);
//         res.status(500).json({ error: 'Failed to generate sales report' });
//     }
// };