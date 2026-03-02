const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
// Cho phép cả Client (5173) và Admin (5174) gọi API
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));
app.use(express.json()); // Giúp server đọc được dữ liệu JSON từ request

// Khai báo Routes
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

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Đã kết nối thành công với MongoDB!');
  })
  .catch((err) => {
    console.log('❌ Lỗi kết nối MongoDB:', err);
  });

// Tạo một API test thử
app.get('/api', (req, res) => {
  res.json({ message: 'E-commerce API đang chạy!' });
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
});