const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity'); // 你需要有這個 model
const jwt = require('jsonwebtoken');

// middleware: 解析 JWT，取得 userId
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.replace(/^Bearer\s/, '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = payload.id;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// 取得 VIP 使用者資訊
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email points points2 gender birthday address city inviteCode');
    if (!user) return res.status(404).json({ error: 'No user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 取得 VIP 活動參與紀錄
router.get('/activities', auth, async (req, res) => {
  try {
    // 假設有 Activity model，每個 activity 有 userId, name, date, usedRose, usedGold
    const activities = await Activity.find({ userId: req.userId })
      .sort({ date: -1 })
      .select('name date usedRose usedGold');
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 取得專屬 QR code 資訊（回傳一個唯一字串給前端產 QR code）
router.get('/qrcode', auth, async (req, res) => {
  try {
    // 假設用戶的 id/email 作為 QR code 內容
    const user = await User.findById(req.userId).select('email _id');
    if (!user) return res.status(404).json({ error: 'No user' });
    // 你可用 user._id、user.email、userId 之類的唯一資訊
    res.json({ value: user._id.toString() });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
