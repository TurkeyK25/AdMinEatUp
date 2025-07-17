const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { UserModel } = require('../EatUpModel');
const COMMON = require('../COMMON');

// API: POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await mongoose.connect(COMMON.uri);

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: '❌ Email không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '❌ Sai mật khẩu' });
    }

    if (user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: '❌ Không có quyền Admin' });
    }

    res.json({ success: true, message: '✅ Đăng nhập thành công', name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '❌ Lỗi server' });
  }
});

module.exports = router;
