const { Code } = require('./model')

module.exports = {
  async add(code) {
    return Code.create({
      code: code
    })
  },
  // 删除二维码信息
  async removeData(code) {
    return Code.deleteMany({ code: code })
  },
  // 根据code查询sessionKey
  async getSessionKey(code) {
    const data = await Code.findOne({ code: code })
    if (data) {
      return data.sessionKey
    }
    return null
  },
}