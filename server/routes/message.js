const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
  createMessage,
  getAllMessages,
  getUnreadCount,
  markAsRead,
  deleteMessage,
} = require('../controllers/messageController');

// Public
router.post('/', createMessage);

// Admin only (đặt /unread-count TRƯỚC /:id)
router.get('/unread-count', verifyToken, verifyAdmin, getUnreadCount);
router.get('/', verifyToken, verifyAdmin, getAllMessages);
router.put('/:id/read', verifyToken, verifyAdmin, markAsRead);
router.delete('/:id', verifyToken, verifyAdmin, deleteMessage);

module.exports = router;
