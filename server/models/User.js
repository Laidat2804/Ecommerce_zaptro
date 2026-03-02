const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Đảm bảo mỗi email chỉ được đăng ký 1 lần
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer' // Mặc định ai đăng ký cũng là khách hàng
  },
  status: {
    type: String,
    enum: ['Active', 'Disabled'],
    default: 'Active'
  },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  ],
  orders: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  ],
}, { 
  timestamps: true // Tự động tạo trường createdAt và updatedAt
});

// Hàm này sẽ tự động chạy TRƯỚC KHI lưu user vào database
userSchema.pre('save', async function(next) {
  // Nếu mật khẩu không bị thay đổi thì bỏ qua
  if (!this.isModified('password')) {
    return;
  }
  
  // Tạo "muối" (salt) để tăng độ khó giải mã
  const salt = await bcrypt.genSalt(10);
  // Mã hóa mật khẩu
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);