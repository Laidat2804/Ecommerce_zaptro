const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getCart,
  syncCart,
  getWishlist,
  toggleWishlistItem,
  getMyOrders,
} = require('../controllers/userProfileController');

// Cart
router.get('/cart', verifyToken, getCart);
router.post('/cart', verifyToken, syncCart);

// Wishlist
router.get('/wishlist', verifyToken, getWishlist);
router.post('/wishlist', verifyToken, toggleWishlistItem);

// Order History (của chính user)
router.get('/orders', verifyToken, getMyOrders);

module.exports = router;
