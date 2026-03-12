const incomeService = require('../services/incomeService');

exports.getAllIncome = async (req, res) => {
    try {
        const income = await incomeService.getAllIncome(req.user.id);
        res.json(income);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createIncome = async (req, res) => {
    try {
        const income = await incomeService.createIncome(req.body, req.user.id);
        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const income = await incomeService.updateIncome(req.params.id, req.body, req.user.id);
        res.json(income);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const result = await incomeService.deleteIncome(req.params.id, req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
