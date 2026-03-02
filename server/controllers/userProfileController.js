const User = require('../models/User');
const Product = require('../models/Product');

// ═══════════════════════════════════
// CART APIs
// ═══════════════════════════════════

// GET /api/profile/cart — Lấy giỏ hàng
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('cart.product', 'name price imageUrl stock category');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Map sang format frontend cần
    const cart = user.cart
      .filter((item) => item.product) // loại bỏ ref bị xóa
      .map((item) => ({
        id: item.product._id,
        title: item.product.name,
        price: item.product.price,
        thumbnail: item.product.imageUrl,
        images: item.product.imageUrl ? [item.product.imageUrl] : [],
        category: item.product.category,
        stock: item.product.stock,
        quantity: item.quantity,
      }));

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// POST /api/profile/cart — Sync giỏ hàng (gửi toàn bộ cart)
const syncCart = async (req, res) => {
  try {
    const { cart } = req.body; // [{ productId, quantity }]

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = (cart || []).map((item) => ({
      product: item.productId || item.id,
      quantity: item.quantity || 1,
    }));
    await user.save();

    res.status(200).json({ message: 'Cart synced!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// ═══════════════════════════════════
// WISHLIST APIs
// ═══════════════════════════════════

// GET /api/profile/wishlist — Lấy wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('wishlist', 'name price imageUrl category');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const wishlist = user.wishlist
      .filter((p) => p) // loại bỏ ref bị xóa
      .map((p) => ({
        id: p._id,
        title: p.name,
        price: p.price,
        thumbnail: p.imageUrl,
        images: p.imageUrl ? [p.imageUrl] : [],
        category: p.category,
      }));

    res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// POST /api/profile/wishlist — Toggle wishlist item
const toggleWishlistItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const idx = user.wishlist.findIndex((id) => id.toString() === productId);
    let action;

    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      action = 'removed';
    } else {
      user.wishlist.push(productId);
      action = 'added';
    }
    await user.save();

    res.status(200).json({ message: `Wishlist ${action}!`, action });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// ═══════════════════════════════════
// ORDER HISTORY (cho customer)
// ═══════════════════════════════════

// GET /api/profile/orders — Lấy order history của user
const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'orders',
        populate: { path: 'products.product', select: 'name price imageUrl' },
        options: { sort: { createdAt: -1 } },
      });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.orders || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

module.exports = {
  getCart,
  syncCart,
  getWishlist,
  toggleWishlistItem,
  getMyOrders,
};
