// 建立数据模型
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  openId: {
    type: String,
    index: true,
    unique: true
  },
  created: {
    type: Date,
    default: Date.now,
  },
  lastLogin: { // 最近登录时间
    type: Date
  },
  name: {
    type: String,
    index: true
  },
  avatar: {
    type: String
  },
  userType: { // 用户类型：标记管理员、普通用户、禁用用户
    type: Number
  }
})

module.exports = {
  User: mongoose.model('User', userSchema),
}