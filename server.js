const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const {UserModel} = require('./EatUpModel');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'eatup_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect('mongodb+srv://EatUp:w7XCJ4kCaLRUsBwD@cluster0.0wmav.mongodb.net/EatUp')
  .then(() => console.log('✅ Đã kết nối MongoDB'))
  .catch(err => console.error('❌ Lỗi MongoDB:', err));

// Login API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'Email không tồn tại' });

    // So sánh password đơn giản
    if (password !== user.password_hash)
      return res.status(401).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar_url: user.avatar_url,
        gender: user.gender
      }
    });

  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
