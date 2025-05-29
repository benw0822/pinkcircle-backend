const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     { type: String, required: true },      // 活動名稱
  date:     { type: String, required: true },      // 參與日期 YYYY-MM-DD 或 Date 型別
  usedRose: { type: Number, default: 0 },          // 使用的 rose 點數
  usedGold: { type: Number, default: 0 },          // 使用的 gold 點數
});

module.exports = mongoose.model('Activity', activitySchema);
