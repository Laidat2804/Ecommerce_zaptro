const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: { type: String, required: true },
      image: { type: String, default: '' },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'COD', 'Bank Transfer'],
    default: 'COD',
  },
  status: {
    type: String,
    enum: ['Pending', 'Awaiting Pickup', 'Out for Delivery', 'Delivered', 'Canceled'],
    default: 'Pending',
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: 'Vietnam' },
  },
}, {
  timestamps: true,
});

// Indexes cho server-side pagination & filtering
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
