const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:    { type: String, unique: true, sparse: true },
  phone:    { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  name:     { type: String },
  points:   { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
