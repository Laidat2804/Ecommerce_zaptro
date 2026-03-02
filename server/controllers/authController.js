const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Thêm dòng này để dùng hàm so sánh

// --- API ĐĂNG KÝ ---
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email này đã được sử dụng!' });
    }

    user = new User({ name, email, password });
    await user.save();

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'Đăng ký thành công!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- API ĐĂNG NHẬP ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kiểm tra xem email có tồn tại trong Database không
    const user = await User.findOne({ email });
    if (!user) {
      // Dùng chung 1 câu thông báo để bảo mật, tránh hacker dò biết email nào có thật
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    // 2. So sánh mật khẩu người dùng nhập vào với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    // 3. Kiểm tra trạng thái tài khoản
    if (user.status === 'Disabled') {
      return res.status(403).json({ message: 'Your account has been disabled. Please contact support.' });
    }

    // 4. Nếu đúng hết, tạo vé thông hành (Token)
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 4. Trả dữ liệu về cho Frontend
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- API lấy thông tin user hiện tại (verify session) ---
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }
    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// Xuất cả 2 hàm ra ngoài
module.exports = {
  register,
  login,
  getMe,
};