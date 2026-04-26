const budgetRepository = require('../repositories/budgetRepository');

const createBudget = async (limit_amount, categoryId, userId, month) => {
  return await budgetRepository.createBudget(limit_amount, categoryId, userId, month);
};

const getBudgets = async (userId) => {
  return await budgetRepository.getBudgetsByUserId(userId);
};

const getBudgetById = async (id) => {
  return await budgetRepository.getBudgetById(id);
};

const updateBudget = async (id, data) => {
  return await budgetRepository.updateBudget(id, data);
};

const deleteBudget = async (id) => {
  return await budgetRepository.deleteBudget(id);
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget
};