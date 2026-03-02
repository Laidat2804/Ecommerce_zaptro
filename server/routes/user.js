const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
  getAllCustomers,
  adminAddUser,
  updateUser,
  toggleUserStatus,
  deleteCustomer,
} = require('../controllers/userController');

// GET    /api/users          — Lấy tất cả customers
router.get('/', verifyToken, verifyAdmin, getAllCustomers);

// POST   /api/users          — Admin tạo customer mới
router.post('/', verifyToken, verifyAdmin, adminAddUser);

// PUT    /api/users/:id      — Cập nhật name/email
router.put('/:id', verifyToken, verifyAdmin, updateUser);

// PATCH  /api/users/:id/status — Toggle Active/Disabled
router.patch('/:id/status', verifyToken, verifyAdmin, toggleUserStatus);

// DELETE /api/users/:id      — Xóa vĩnh viễn
router.delete('/:id', verifyToken, verifyAdmin, deleteCustomer);

module.exports = router;
