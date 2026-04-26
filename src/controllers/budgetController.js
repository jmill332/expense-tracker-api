const budgetService = require('../services/budgetService');

const createBudget = async (req, res) => {
  try {
    const { limit_amount, category_id, month } = req.body;
    const userId = req.user.userId;

    if (limit_amount === undefined || !category_id || !month) {
      return res.status(400).json({ error: 'Limit amount, category_id, and month are required' });
    }

    const budget = await budgetService.createBudget(
      parseFloat(limit_amount),
      parseInt(category_id),
      userId,
      month
    );

    res.status(201).json({ message: 'Budget set successfully', budget });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const userId = req.user.userId;
    const budgets = await budgetService.getBudgets(userId);
    res.status(200).json(budgets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBudgetById = async (req, res) => {
  try {
    const budget = await budgetService.getBudgetById(req.params.id);
    if (!budget) return res.status(404).json({ error: "Budget not found" });
    if (budget.user_id !== req.user.userId) return res.status(403).json({ error: "Not the owner" });
    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { limit_amount, month, category_id } = req.body;
    const budget = await budgetService.getBudgetById(req.params.id);

    if (!budget) return res.status(404).json({ error: "Budget not found" });
    if (budget.user_id !== req.user.userId) return res.status(403).json({ error: "Not the owner" });

    const updated = await budgetService.updateBudget(req.params.id, {
      limit_amount: limit_amount ? parseFloat(limit_amount) : undefined,
      month,
      category_id: category_id ? parseInt(category_id) : undefined
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await budgetService.getBudgetById(req.params.id);
    if (!budget) return res.status(404).json({ error: "Budget not found" });
    if (budget.user_id !== req.user.userId) return res.status(403).json({ error: "Not the owner" });

    await budgetService.deleteBudget(req.params.id);
    res.status(200).json({ id: req.params.id, message: "Budget deleted" });
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget
};