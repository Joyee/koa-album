const { decode } = require('../crypto')
const { User } = require('./model')

async function getByOpenId(openId) {
  const users = await User.find({ openId })
  if (users.length) {
    return users[0]
  }
  return null
}

module.exports = {
  // 获取openid后 在系统的用户表中查询改openid是否已经存在，如果不存在 就创建一个与这个openid关联的用户
  async login(openId) {
    const user = await getByOpenId(openId)
    if (!user) {
      user = await User.create({ openId })
    }
    const id = user._id
    const sessionKey = encode(id)
    await User.updateOne({ _id: id }, {
      lastLogin: Date.now()
    })
    return {
      sessionKey // 返回登录凭证
    }
  },
  // 根据登录凭证获取用户 先解密获取用户id和凭证产生的时间 然后校验凭证是否过期
  async findBySessionKey(sessionKey) {
    const { id, timespan } = decode(sessionKey)
    if (Date.now() - timespan > 1000 * 60 * 60 * 24 * 3) { // 默认超时时间为3天
      return null
    }
    const users = await User.find({ _id: id })
    if (users.length) {
      return users[0]
    }
    return null
  },
  async getUsers(pageIndex, pageSize) {
    return User.find().limit(pageSize).skip((pageIndex - 1) * pageSize)
  },
  async getUsersCount() {
    return User.count()
  },
}
