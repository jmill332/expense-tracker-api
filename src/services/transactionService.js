const transactionRepository = require('../repositories/transactionRepository');

const createTransaction = async (amount, description, categoryId, userId, type) => {
  return await transactionRepository.createTransaction(amount, description, categoryId, userId, type);
};

const getTransactions = async (userId) => {
  return await transactionRepository.getTransactionsByUserId(userId);
};

const getTransactionById = async (id) => {
  return await transactionRepository.getTransactionById(id);
};

const updateTransaction = async (id, data) => {
  return await transactionRepository.updateTransaction(id, data);
};

const deleteTransaction = async (id) => {
  return await transactionRepository.deleteTransaction(id);
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};