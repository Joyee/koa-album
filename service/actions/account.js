const { getSession } = require('../lib/wx')
const { encodeErCode, decode } = require('../lib/crypto')
const { add, removeData, getSessionKey, } = require('../lib/db/code')
const { Code } = require('../lib/db/model')
const { getUsersCount, getUsers } = require('../lib/db/user')

module.exports = {
  async login(code) {
    const session = await getSession(code)
    if (session) {
      const { openid } = session
      return login(openid)
    } else {
      throw new Error('登录失败')
    }
  },
  async getErCode() {
    const code = encodeErCode() // 生成二维码
    await add(code)
    // 定时清除二维码信息 避免数据库存在过多冗余信息
    setTimeout(() => {
      removeData(code)
    }, 30000)
    return code
  },
  // 将登录凭证更新到二维码信息中
  async setSessionKeyForCode(code, sessionKey) {
    const { timespan } = decode(code)
    // 30s过期 通过控制过期时间，可以有效减少数据库中存储的二维码的记录体积，有利于提升二维码扫码的性能
    if (Date.now() - timespan > 30000) {
      throw Error('time out')
    }
    await updateSessionKey(code, sessionKey)
  },
  async updateSessionKey(code, sessionKey) {
    return Code.updateOne({
      code: code
    }, {
      sessionKey: sessionKey
    })
  },
  // 通过code获取登录凭证
  async getSessionKeyByCode(code) {
    const sessionKey = await getSessionKey(code)
    if (sessionKey) {
      await removeData(code) // 查询到登录凭证后 从数据库中清除当前数据
    }
    return sessionKey
  },
  async getUsers(pageIndex, pageSize) {
    const { count, users } = await Promise.all([getUsersCount(), getUsers(pageIndex, pageSize)])
    return {
      count,
      data: users
    }
  },
}

