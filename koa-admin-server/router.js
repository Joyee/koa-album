const router = require('koa-router')()

module.exports = (app) => {
  // 获取照片列表 status: all pending accepted rejected
  router.get('/photos/:status', async (ctx, next) => {})
  // 操作照片
  router.put('/photos/:id', async (ctx, next) => {})
  // 获取用户列表
  router.get('/users/:status', async (ctx, next) => {})
  // 操作用户权限
  router.put('/users/:id', async (ctx, next) => {})
  // 登录
  router.post('/login', async (ctx, next) => {})
  // 退出
  router.post('/logout', async (ctx, next) => {})
  app.use(router.routes()).use(router.allowedMethods())
}
