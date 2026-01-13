const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');

// 1. Dashboard Summary
router.get('/stats', dashboardController.getDashboardStats);

// 2. Lead Status Breakdown
router.get('/leads/status-breakdown', dashboardController.getLeadStatusBreakdown);

// 3. Sales Trend (pass ?days=7 or ?days=30 optionally)
router.get('/sales/trend', dashboardController.getSalesTrend);

// 4. Revenue Trend (pass ?days=7 or ?days=30 optionally)
router.get('/revenue/trend', dashboardController.getRevenueTrend);

// 5. Top Performers
router.get('/performance/top-users', dashboardController.getTopPerformers);

// 6. Team Performance
router.get('/performance/teams', dashboardController.getTeamPerformance);

// 7. Recent Sales
router.get('/sales/recent', dashboardController.getRecentSales);

// 8. Recent Invoices
router.get('/invoices/recent', dashboardController.getRecentInvoices);

// 9. Invoice Summary (Pending, Paid, Partial)
router.get('/invoices/summary', dashboardController.getInvoiceSummary);

// 10. Lead Source Breakdown
router.get('/leads/sources', dashboardController.getLeadSourcesBreakdown);

// 11. Lead Follow-up Alerts
router.get('/leads/follow-ups', dashboardController.getLeadFollowUpAlerts);

// 12. Service Stats
router.get('/services/stats', dashboardController.getServiceStats);

// 13. System Activity (new users, remote access, suspended)
router.get('/system/activity', dashboardController.getSystemActivity);


module.exports = router;
