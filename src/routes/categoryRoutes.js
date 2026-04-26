const express = require('express');
const categoryController = require('../controllers/categoryController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all category routes with our JWT middleware
router.use(authenticateToken);

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;