const categoryService = require('../services/categoryService');

const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const category = await categoryService.createCategory(name, userId);
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categories = await categoryService.getCategories(userId);
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    
    if (!category) return res.status(404).json({ error: "Category not found" });
    if (category.user_id !== req.user.userId) return res.status(403).json({ error: "Not the owner" });

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Invalid data" });

    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    if (category.user_id !== req.user.userId) return res.status(403).json({ error: "Not the owner" });

    const updated = await categoryService.updateCategory(req.params.id, name);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    if (category.user_id !== req.user.userId) return res.status(403).json({ error: "Not the owner" });

    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ id: req.params.id, message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};