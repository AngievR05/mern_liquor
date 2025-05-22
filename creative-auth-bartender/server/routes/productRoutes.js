import express from 'express';
const router = express.Router();
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  likeProduct,
  commentOnProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);

// Admin-only
router.post('/', protect, admin, addProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// User actions
router.post('/:id/like', protect, likeProduct);
router.post('/:id/comment', protect, commentOnProduct);

module.exports = router;