const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// --- Lấy orders có phân trang server-side (ADMIN) ---
const getAllOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const status = req.query.status; // 'Pending', 'Delivered', etc.
    const search = req.query.search || '';

    // Build filter
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Search by user name/email requires populate → dùng pipeline hoặc post-filter
    // Nếu có search, fetch thêm user info
    let query = Order.find(filter)
      .populate('user', 'name email')
      .select('-shippingAddress')
      .sort({ createdAt: -1 });

    // Tổng số orders theo filter (chưa search)
    let totalOrders;
    let orders;

    if (search) {
      // Khi có search, cần fetch tất cả để filter theo user name/email
      // (vì search trên populated field không dùng được skip/limit trực tiếp)
      const allOrders = await query.lean();
      const q = search.toLowerCase();
      const filtered = allOrders.filter((o) => {
        const orderId = o._id?.toString().slice(-6).toLowerCase() || '';
        const name = o.user?.name?.toLowerCase() || '';
        const email = o.user?.email?.toLowerCase() || '';
        return orderId.includes(q) || name.includes(q) || email.includes(q);
      });
      totalOrders = filtered.length;
      orders = filtered.slice((page - 1) * limit, page * limit);
    } else {
      totalOrders = await Order.countDocuments(filter);
      orders = await query.skip((page - 1) * limit).limit(limit).lean();
    }

    const totalPages = Math.max(1, Math.ceil(totalOrders / limit));

    // Aggregate status counts (cho filter tabs)
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const statusCounts = { All: 0 };
    statusBreakdown.forEach((s) => {
      statusCounts[s._id] = s.count;
      statusCounts.All += s.count;
    });

    res.status(200).json({
      orders,
      totalPages,
      currentPage: page,
      totalOrders,
      statusCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Cập nhật trạng thái đơn hàng ---
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Awaiting Pickup', 'Out for Delivery', 'Delivered', 'Canceled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ!' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
    }

    res.status(200).json({ message: 'Cập nhật trạng thái thành công!', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Customer tạo đơn hàng mới (Snapshot) ---
const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, paymentMethod, shippingAddress } = req.body;
    const userId = req.user.userId;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Đơn hàng phải có ít nhất 1 sản phẩm!' });
    }

    // Lấy tất cả productIds
    const productIds = products.map((p) => p.productId);

    // Query DB để lấy thông tin mới nhất (KHÔNG tin tưởng FE)
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const productMap = {};
    dbProducts.forEach((p) => { productMap[p._id.toString()] = p; });

    // Build snapshot items
    const snapshotItems = products.map((p) => {
      const dbProduct = productMap[p.productId];
      if (!dbProduct) {
        throw new Error(`Sản phẩm ${p.productId} không tồn tại!`);
      }
      return {
        product: dbProduct._id,
        name: dbProduct.name,
        image: dbProduct.imageUrl || '',
        quantity: p.quantity,
        price: dbProduct.price, // Lấy giá từ DB, không từ FE
      };
    });

    // Tính lại tổng tiền từ DB
    const calculatedTotal = snapshotItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      user: userId,
      products: snapshotItems,
      totalAmount: calculatedTotal,
      paymentMethod: paymentMethod || 'COD',
      shippingAddress: shippingAddress || {},
      status: 'Pending',
    });
    await order.save();

    // Push order vào user.orders + xóa cart
    await User.findByIdAndUpdate(userId, {
      $push: { orders: order._id },
      $set: { cart: [] },
    });

    // Populate user info
    const populated = await Order.findById(order._id)
      .populate('user', 'name email');

    res.status(201).json({ message: 'Đặt hàng thành công!', order: populated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Lỗi Server!' });
  }
};

// --- Dashboard Stats tổng hợp ---
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Revenue (chỉ tính đơn Delivered)
    const revenueResult = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // 2. Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Total Customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // 4. Low Stock Items (stock < 10)
    const lowStockItems = await Product.countDocuments({ stock: { $lt: 10 } });

    // 5. Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Order status breakdown
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const statusCounts = {};
    statusBreakdown.forEach((s) => { statusCounts[s._id] = s.count; });

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      lowStockItems,
      recentOrders,
      statusCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Customer tự hủy đơn hàng ---
const customerCancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
    }

    // Security: chỉ chủ đơn hàng mới được hủy
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền hủy đơn hàng này!' });
    }

    // Business rule: chỉ hủy được khi Pending hoặc Awaiting Pickup
    const cancelable = ['Pending', 'Awaiting Pickup'];
    if (!cancelable.includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be canceled at this stage' });
    }

    order.status = 'Canceled';
    await order.save();

    const populated = await Order.findById(order._id)
      .populate('user', 'name email');

    res.status(200).json({ message: 'Đơn hàng đã được hủy!', order: populated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getDashboardStats,
  customerCancelOrder,
};
