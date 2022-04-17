const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const app = new Koa()

app.use(bodyparser({ multipart: true }))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.body = {
      status: -1,
      message: error.message || error,
      code: error.status
    }
  }
})

app.listen(3000)