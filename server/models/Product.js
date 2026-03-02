const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên sản phẩm là bắt buộc!'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Giá sản phẩm là bắt buộc!'],
    min: [0, 'Giá không được âm']
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=No+Image'
  },
  category: {
    type: String,
    trim: true,
    default: 'Uncategorized'
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Số lượng không được âm']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
