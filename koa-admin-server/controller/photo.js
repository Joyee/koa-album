const model = require('../model/home')

const status = {
  all: -1,
  pending: 0,
  accepted: 1,
  rejected: 2
}

module.exports = {
  getPhotos: async (ctx, next) => {
    let _status = ctx.params.status
    ctx.body = model.getPhotos(status[_status])
  }
}
