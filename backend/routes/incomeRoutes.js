const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', incomeController.getAllIncome);
router.post('/', incomeController.createIncome);
router.put('/:id', incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
