const path = require('path')
const Router = require('koa-router')
const multer = require('koa-multer')
const uuid = require('uuid')
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
router.delete('/album/:id', auth, async (context, next) => {
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
// 定义为采用磁盘存储
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename(req, file, cb) { // 重命名 避免重名
    const ext = path.extname(file.originalname)
    cb(null, uuid.v4() + ext)
  }
})
// 上传的中间件
const uploader = multer({
  storage
})
// 上传
router.post('/photo', auth, uploader.single('file'), async (context, next) => {
  const { file } = context.req // 读取上传的文件对象 由上传中间件提供
  const { id } = context.req.body // 获取请求中传递的相册id
  await photo.add(context.state.id, `https//{static.album.cn/${file.filename}}`, id)
  await next()
}, responseOK)

router.delete('/photo/:id', auth, async (context, next) => {
  const p = await photo.getPhotoById(context.params.id)
  if (p) {
    if (p.userId === context.state.user.id || context.state.user.isAmin) {
      await photo.delete(context.params.id)
    } else {
      context.throw(403, '该用户无删除权限')
    }
  }
  await next()
}, responseOK)

function getPageParams(context) {
  return {
    pageIndex: parseInt(context.params.pageIndex) || 1,
    pageSize: parseInt(context.params.pageSize) || 10
  }
}
// 定义用户列表接口
router.get('/admin/user', auth, async (context, next) => {
  const pageParams = getPageParams(context)
  context.body = {
    status: 0,
    data: await account.getUsers(pageParams.pageIndex, pageParams.pageSize)
  }
  await next()
})
// 设置/取消设置管理员权限、禁用/取消禁用用户
router.get('/admin/user/:id/userType/:type', auth, async (context, next) => {
  const body = {
    status: 0,
    data: await account.setUserType(context.params.id, context.params.type)
  }
  context.body = body
  await next()
})
/**
 * 获取待审核照片列表、已审核照片列表、审核被拒绝的照片列表
 * type类型如下：
 * pending：待审核列表
 * accepted：审核通过列表
 * rejected：审核未通过列表
 * all: 获取所有列表
 */
router.get('/album/photo/:type', auth, async (context, next) => {
  const params = getPageParams(context.params)
  // 按照审核状态获取数据
  const photos = await photo.getPhotosByType(params.type, params.pageIndex, params.pageSize)
  context.body = {
    status: 0,
    data: photos
  }
})

module.exports = router