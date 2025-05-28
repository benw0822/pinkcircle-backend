const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// 註冊
router.post('/register', async (req, res) => {
  try {
    const { email, phone, password, name } = req.body;
    if (!((email || phone) && password)) {
      return res.status(400).json({ message: 'Email或手機和密碼為必填' });
    }
    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(400).json({ message: 'Email或手機已註冊' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, phone, password: hashedPassword, name });
    await user.save();
    res.json({ message: '註冊成功' });
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 登入
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    if (!((email || phone) && password)) {
      return res.status(400).json({ message: 'Email或手機和密碼為必填' });
    }
    let user = await User.findOne(email ? { email } : { phone });
    if (!user) {
      return res.status(400).json({ message: '帳號不存在' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '密碼錯誤' });
    }
    // 發送 JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        points: user.points
      }
    });
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

module.exports = router;
