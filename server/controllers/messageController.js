const Message = require('../models/Message');

// POST /api/messages — Public: khách gửi feedback
const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    const msg = await Message.create({ name, email, message });
    res.status(201).json({ message: 'Gửi tin nhắn thành công!', data: msg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// GET /api/messages — Admin: lấy tất cả tin nhắn
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// GET /api/messages/unread-count — Admin: đếm chưa đọc
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({ isRead: false });
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// PUT /api/messages/:id/read — Admin: đánh dấu đã đọc
const markAsRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: 'Không tìm thấy tin nhắn!' });
    res.status(200).json({ message: 'Đã đánh dấu đã đọc!', data: msg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

// DELETE /api/messages/:id — Admin: xóa tin nhắn
const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Không tìm thấy tin nhắn!' });
    res.status(200).json({ message: 'Đã xóa tin nhắn!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server!' });
  }
};

module.exports = { createMessage, getAllMessages, getUnreadCount, markAsRead, deleteMessage };
