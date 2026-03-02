const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- Lấy tất cả customers (ADMIN only) ---
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .populate('wishlist', 'name price imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Admin tạo tài khoản customer mới ---
const adminAddUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email này đã được sử dụng!' });
    }

    const user = new User({ name, email, password, role: 'customer' });
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({ message: 'Tạo tài khoản thành công!', user: userData });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Cập nhật thông tin customer (name, email) ---
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Kiểm tra email trùng (nếu đổi email)
    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: 'Email này đã được sử dụng!' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    res.status(200).json({ message: 'Cập nhật thành công!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Toggle trạng thái Active/Disabled ---
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    user.status = user.status === 'Active' ? 'Disabled' : 'Active';
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: `Đã ${user.status === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản!`,
      user: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Xóa customer vĩnh viễn ---
const deleteCustomer = async (req, res) => {
  try {
    // Không cho admin tự xóa chính mình
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ message: 'Không thể tự xóa tài khoản của mình!' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    res.status(200).json({ message: 'Xóa người dùng thành công!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

module.exports = {
  getAllCustomers,
  adminAddUser,
  updateUser,
  toggleUserStatus,
  deleteCustomer,
};
