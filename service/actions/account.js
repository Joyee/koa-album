const { getSession } = require('../lib/wx')
module.exports = {
  async login(code) {
    const session = await getSession(code)
    if (session) {
      const { openid } = session
      return login(openid)
    } else {
      throw new Error('登录失败')
    }
  }
}
