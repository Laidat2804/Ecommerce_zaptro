const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// --- Routes PUBLIC ---
router.get('/', getAllProducts);           // GET /api/products
router.get('/:id', getProductById);       // GET /api/products/:id

// --- Routes ADMIN (cần đăng nhập + quyền admin) ---
router.post('/', verifyToken, verifyAdmin, upload.single('image'), createProduct);
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);

module.exports = router;
