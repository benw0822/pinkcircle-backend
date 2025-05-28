require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

// 1. 掛載會員登入/註冊相關路由
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // 登入路徑會是 /api/auth/login

// 2. 掛載會員資料相關路由
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes); // 查詢會員資料是 /api/user/me

// 連線到 MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// 首頁測試
app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
