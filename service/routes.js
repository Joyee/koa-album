const Router = require('koa-router')
const account = require('./actions/account')
const photo = require('./actions/photo')
const router = new Router()
const auth = require('./middleware/auth')

async function responseOK(context, next) {
  context.body = {
    status: 0
  }
  await next()
}

/**
 * 扫码登录，获取二维码
 */
router.get('/login/ercode', async (context, next) => {
  context.body = {
    status: 0,
    data: await account
  }
})
/**
 * 小程序侧调用。
 * 小程序扫码后将扫到的二维码信息附带凭证传递过来
 */
router.get('/login/ercode/:code', async (context, next) => {
  const code = context.params.code // 获取参数中的二维码字符串
  const sessionKey = context.get('x-session') // 获取登录凭证
  await account.updateSessionKey(code, sessionKey)
  await next()
}, responseOK) // 统一输出接口
/**
 * 扫码登录页面生成二维码后，开启轮询。查询当前生成的二维码是否被扫描
 * 这里采用长轮询（提高轮询效率）
 */
router.get('/login/errcode/check/:code', async (context, next) => {
  const startTime = Date.now()
  async function login() {
    const code = context.params.code // 获取二维码信息
    const sessionKey = await account.getSessionKeyByCode(code)
    if (sessionKey) { // 登录成功
      context.body = {
        status: 0,
        data: {
          sessionKey: sessionKey
        }
      }
    } else {
      if (Date.now() - startTime < 10000) { // 10s内
        await new Promise((resolve) => { // 等待下一个tick执行完成
          process.nextTick(() => {
            resolve()
          })
        })
        await login() // 继续递归查询
      } else {
        // 超时 直接返回
        context.body = { status: -1 }
      }
    }
  }
  await login() // 启动递归查询
})
// 创建相册
router.post('/album', auth, async (context, next) => {
  const { name } = context.request.body
  await photo.addAlbum(context.state.user.id, name)
  await next()
}, responseOK)
// 修改相册
router.put('/album/:id', auth, async (context, next) => {
  await photo.updateAlbum(context.params.id, context.body.name, context.user)
  await next()
}, responseOK)
// 删除相册
router.del('/album/:id', auth, async (context, next) => {
  await photo.deleteAlbum(context.params.id, context.user)
  await next()
}, responseOK)
// 相册列表 小程序中展示每个相册中照片的数量
router.get('/xcx/album', auth, async (context, next) => {
  const albums = await photo.getAlbums(context.state.user.id)
  context.body = {
    status: 0,
    data: albums
  }
})

module.exports = router