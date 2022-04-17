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

// 相册模型
const albumSchema = new Schema({
  userId: { // 相册拥有者
    type: String
  },
  name: { // 相册名称
    type: String
  },
}, { // 对数据模型的描述
  versionKey: false,
  timestamps: { createdAt: 'created', updatedAt: 'updated' }
})
// 照片模型
// 照片的数据一般不会存储在数据库中 而会存储在专门的图片服务器上。在本次项目中 简化为存储在应用的目录下
const photoSchema = new Schema({
  userId: {
    type: String
  },
  url: { // 存储照片的可访问地址
    type: String
  },
  isApproved: { // 照片审核字段
    type: Boolean,
    default: null, // 默认为null，表示未审核
    index: true
  },
  albumId: {
    type: Schema.Types.ObjectId
  },
  created: {
    type: Date,
  },
  isDelete: {
    type: Boolean,
    default: false
  }
})

module.exports = {
  User: mongoose.model('User', userSchema),
  Code: mongoose.model('Code', codeSchema),
  Album: mongoose.model('Album', albumSchema),
  Photo: mongoose.model('Photo', photoSchema)
}