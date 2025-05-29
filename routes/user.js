const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// 註冊新會員
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, gender, birthday, address, note } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email 和密碼必填' });
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ error: '信箱已註冊' });
    }
    const user = new User({ email, password, name, phone, gender, birthday, address, note });
    await user.save();
    res.json({ message: '註冊成功' });
  } catch (err) {
    res.status(500).json({ error: '註冊失敗' });
  }
});

// 登入
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email 和密碼必填' });
    }
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: '帳號或密碼錯誤' });
    }
    // 產生 JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: '登入失敗' });
  }
});

// 查詢自己會員資料
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// 修改自己會員資料（允許修改 points 欄位）
router.put('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // 允許更新 points 欄位
    const updateFields = ['name', 'email', 'phone', 'birthday', 'address', 'gender', 'note', 'points'];
    updateFields.forEach(field => {
      if (typeof req.body[field] !== 'undefined') {
        user[field] = req.body[field];
      }
    });
    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token or update failed' });
  }
});

module.exports = router;
