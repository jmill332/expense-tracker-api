const categoryRepository = require('../repositories/categoryRepository');

const createCategory = async (name, userId) => {
  return await categoryRepository.createCategory(name, userId);
};

const getCategories = async (userId) => {
  return await categoryRepository.getCategoriesByUserId(userId);
};

const getCategoryById = async (id) => {
  return await categoryRepository.getCategoryById(id);
};

const updateCategory = async (id, name) => {
  return await categoryRepository.updateCategory(id, name);
};

const deleteCategory = async (id) => {
  return await categoryRepository.deleteCategory(id);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};