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
    type: Number,
    default: 0,
  }
})

const codeSchema = new Schema({
  code: { // 存储二维码字符串
    type: String,
  },
  sessionKey: String, // 存储小程序的登录凭证
})

module.exports = {
  User: mongoose.model('User', userSchema),
  Code: mongoose.model('Code', codeSchema),
}