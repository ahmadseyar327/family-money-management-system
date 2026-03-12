const expenseService = require('../services/expenseService');

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await expenseService.getAllExpenses(req.user.id, req.query);
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createExpense = async (req, res) => {
    try {
        const expense = await expenseService.createExpense(req.body, req.user.id);
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const expense = await expenseService.updateExpense(req.params.id, req.body, req.user.id);
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const result = await expenseService.deleteExpense(req.params.id, req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
