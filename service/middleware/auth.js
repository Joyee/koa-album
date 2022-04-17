const { findBySessionKey } = require('../lib/db/user')

module.exports = async function(ctx, next) {
  const sessionKey = ctx.get('x-session') // 获取登录凭证
  if (!sessionKey) {
    ctx.throw(401, '请求头中未包含x-session')
  }
  const user = await findBySessionKey(sessionKey)
  if (user) {
    ctx.state.user = { // 将用户存储在上下文中
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      isAdmin: user.userType === 1
    }
  } else {
    ctx.throw(401, 'session过期')
  }
  await next()
}