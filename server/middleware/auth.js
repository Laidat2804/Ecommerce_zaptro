const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- Middleware xác thực Token ---
const verifyToken = async (req, res, next) => {
  // Lấy token từ header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token không tồn tại! Vui lòng đăng nhập.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Giải mã token và gắn thông tin user vào req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }

    // Kiểm tra user còn tồn tại và chưa bị Disabled
    const user = await User.findById(decoded.userId).select('status role');
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại!', code: 'ACCOUNT_NOT_FOUND' });
    }
    if (user.status === 'Disabled') {
      return res.status(403).json({ message: 'Your account has been disabled. Please contact support.', code: 'ACCOUNT_DISABLED' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

// --- Middleware kiểm tra quyền Admin ---
// Phải chạy SAU verifyToken
const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực!' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập! Chỉ Admin mới được phép.' });
  }

  next();
};

module.exports = { verifyToken, verifyAdmin };
