const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const createCategory = async (name, userId) => {
  return await prisma.category.create({
    data: {
      name,
      user_id: userId
    }
  });
};

const getCategoriesByUserId = async (userId) => {
  return await prisma.category.findMany({
    where: { user_id: userId }
  });
};

const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id: parseInt(id) }
  });
};

const updateCategory = async (id, name) => {
  return await prisma.category.update({
    where: { id: parseInt(id) },
    data: { name }
  });
};

const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createCategory,
  getCategoriesByUserId,
  getCategoryById,
  updateCategory,
  deleteCategory
};