const express = require('express');
const budgetController = require('../controllers/budgetController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.post('/', budgetController.createBudget);
router.get('/', budgetController.getBudgets);
router.get('/:id', budgetController.getBudgetById);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;