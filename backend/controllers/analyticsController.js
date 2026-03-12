const analyticsService = require('../services/analyticsService');

exports.getSummary = async (req, res) => {
    try {
        const { month, year } = req.query;
        const summary = await analyticsService.getSummary(req.user.id, month, year);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMemberSpending = async (req, res) => {
    try {
        const { month, year } = req.query;
        const spending = await analyticsService.getMemberSpending(req.user.id, month, year);
        res.json(spending);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMonthlySummary = async (req, res) => {
    try {
        const { year } = req.query;
        const summary = await analyticsService.getMonthlySummary(req.user.id, year);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getExpensesByCategory = async (req, res) => {
    try {
        const { month, year } = req.query;
        const expenses = await analyticsService.getExpensesByCategory(req.user.id, month, year);
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
