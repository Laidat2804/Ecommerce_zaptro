const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// Helper: Upload buffer lên Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'ecommerce/products', resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// --- Lấy tất cả sản phẩm (PUBLIC) ---
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Lấy 1 sản phẩm theo ID (PUBLIC) ---
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Tạo sản phẩm mới (ADMIN) ---
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    let imageUrl;

    // Nếu có file upload → upload lên Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      imageUrl,
      category,
      stock: Number(stock) || 0,
    });

    await product.save();
    res.status(201).json({ message: 'Tạo sản phẩm thành công!', product });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Cập nhật sản phẩm (ADMIN) ---
const updateProduct = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock) || 0,
    };

    // Nếu có file upload mới → upload lên Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.imageUrl = result.secure_url;
    } else if (req.body.imageUrl) {
      updateData.imageUrl = req.body.imageUrl;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
    }

    res.status(200).json({ message: 'Cập nhật sản phẩm thành công!', product });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// --- Xóa sản phẩm (ADMIN) ---
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
    }

    res.status(200).json({ message: 'Xóa sản phẩm thành công!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
