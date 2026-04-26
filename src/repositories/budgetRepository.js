const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBudget = async (limit_amount, categoryId, userId, month) => {
  return await prisma.budget.create({
    data: {
      limit_amount,
      category_id: categoryId,
      user_id: userId,
      month
    }
  });
};

const getBudgetsByUserId = async (userId) => {
  return await prisma.budget.findMany({
    where: { user_id: userId },
    include: { category: true }
  });
};

const getBudgetById = async (id) => {
  return await prisma.budget.findUnique({
    where: { id: parseInt(id) }
  });
};

const updateBudget = async (id, data) => {
  return await prisma.budget.update({
    where: { id: parseInt(id) },
    data: {
      limit_amount: data.limit_amount,
      month: data.month,
      category_id: data.category_id
    }
  });
};

const deleteBudget = async (id) => {
  return await prisma.budget.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createBudget,
  getBudgetsByUserId,
  getBudgetById,
  updateBudget,
  deleteBudget
};