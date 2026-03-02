const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getDashboardStats,
  customerCancelOrder,
} = require('../controllers/orderController');

// GET    /api/orders/dashboard  — Dashboard stats (phải đặt TRƯỚC /:id)
router.get('/dashboard', verifyToken, verifyAdmin, getDashboardStats);

// GET    /api/orders            — Lấy tất cả orders (ADMIN)
router.get('/', verifyToken, verifyAdmin, getAllOrders);

// POST   /api/orders            — Customer tạo đơn hàng
router.post('/', verifyToken, createOrder);

// PATCH  /api/orders/:id/status — Cập nhật trạng thái (ADMIN)
router.patch('/:id/status', verifyToken, verifyAdmin, updateOrderStatus);

// PATCH  /api/orders/:id/cancel — Customer tự hủy đơn hàng
router.patch('/:id/cancel', verifyToken, customerCancelOrder);

module.exports = router;
