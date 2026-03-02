const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. CẤU HÌNH CORS CHO PHÉP NHIỀU DOMAIN
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174',
  'https://ecommercezaptro.vercel.app',       // Link trang khách của bạn
  'https://ecommerce-zaptro-admin.vercel.app'  // Link trang Admin bạn sắp deploy
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép các request không có origin (như Postman hoặc cùng server) 
    // và các origin nằm trong whitelist
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Chặn bởi CORS: Origin không hợp lệ'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Khai báo Routes (Giữ nguyên của bạn)
const authRoute = require('./routes/auth'); 
app.use('/api/auth', authRoute);
const productRoute = require('./routes/product');
app.use('/api/products', productRoute);
const userRoute = require('./routes/user');
app.use('/api/users', userRoute);
const orderRoute = require('./routes/order');
app.use('/api/orders', orderRoute);
const userProfileRoute = require('./routes/userProfile');
app.use('/api/profile', userProfileRoute);
const messageRoute = require('./routes/message');
app.use('/api/messages', messageRoute);

// 2. KẾT NỐI MONGODB (Tối ưu cho Serverless)
// Kiểm tra trạng thái kết nối để tránh tạo nhiều connection thừa
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.log('❌ MongoDB Error:', err));
}

app.get('/api', (req, res) => {
  res.json({ message: 'E-commerce API đang chạy trên Vercel!' });
});

// 3. CHỈ CHẠY LISTEN KHI Ở LOCAL
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
  });
}

module.exports = app; // Bắt buộc phải có để Vercel nhận diện