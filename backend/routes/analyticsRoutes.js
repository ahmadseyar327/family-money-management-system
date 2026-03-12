const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/summary', analyticsController.getSummary);
router.get('/member-spending', analyticsController.getMemberSpending);
router.get('/monthly', analyticsController.getMonthlySummary);
router.get('/categories', analyticsController.getExpensesByCategory);

module.exports = router;
