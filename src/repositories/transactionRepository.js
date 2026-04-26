const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const createTransaction = async (amount, description, categoryId, userId, type) => {
  return await prisma.transaction.create({
    data: {
      amount,
      description,
      category_id: categoryId,
      user_id: userId,
      type
    }
  });
};

const getTransactionsByUserId = async (userId) => {
  return await prisma.transaction.findMany({
    where: { user_id: userId },
    include: { category: true } // This automatically fetches the category name too!
  });
};

const getTransactionById = async (id) => {
  return await prisma.transaction.findUnique({ where: { id: parseInt(id) } });
};

const updateTransaction = async (id, data) => {
  return await prisma.transaction.update({
    where: { id: parseInt(id) },
    data: data
  });
};

const deleteTransaction = async (id) => {
  return await prisma.transaction.delete({ where: { id: parseInt(id) } });
};

module.exports = {
  createTransaction,
  getTransactionsByUserId,
  getTransactionById,
  updateTransaction,
  deleteTransaction

};