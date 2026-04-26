const transactionService = require('../services/transactionService');

const createTransaction = async (req, res) => {
  try {
    const { amount, description, category_id, type } = req.body;
    const userId = req.user.userId; 

    if (amount === undefined || !description || !category_id || !type) {
      return res.status(400).json({ error: 'Invalid or missing fields' });
    }

    const transaction = await transactionService.createTransaction(
      parseFloat(amount),
      description, 
      parseInt(category_id),
      userId,
      type
    );
    
    res.status(201).json({ message: 'Transaction logged successfully', transaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await transactionService.getTransactions(userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    if (transaction.user_id !== req.user.userId) return res.status(403).json({ error: "Not the owner" });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { amount, description, type, category_id } = req.body;
    const transaction = await transactionService.getTransactionById(req.params.id);

    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    if (transaction.user_id !== req.user.userId) return res.status(403).json({ error: "Not the owner" });

    const updated = await transactionService.updateTransaction(req.params.id, {
      amount: amount ? parseFloat(amount) : undefined,
      description,
      type,
      category_id: category_id ? parseInt(category_id) : undefined
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);

    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    if (transaction.user_id !== req.user.userId) return res.status(403).json({ error: "Not the owner" });

    await transactionService.deleteTransaction(req.params.id);
    res.status(200).json({ id: req.params.id, message: "Transaction deleted" });
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
};


module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
