const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:    { type: String, unique: true, sparse: true },
  phone:    { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  name:     { type: String },
  points:   { type: Number, default: 0 },
  points2:  { type: Number, default: 0 },
  gender:   { type: String },
  birthday: { type: String }, // 格式如 "1995-01-01"
  address:  { type: String },
  city:     { type: String },      // 新增
  inviteCode: { type: String },    // 新增
  note:     { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
