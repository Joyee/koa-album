// 需要根据小程序传来的code，结合AppID和AppSecret调用微信的OAuth接口获取OpenID和SessionKey
// https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
const { AppID, AppSecret } = require('../config')
const request = require('request')

module.exports = {
  async getSession(code) {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`
    return new Promise((resolve, reject) => {
      request(url, {
        method: 'GET',
        json: true,
      }, (error, res, body) => {
        if (error) {
          reject(error)
        } else {
          if (body.errcode) { // 处理微信接口返回的异常
            reject(new Error(body.errmsg))
          } else {
            resolve(body)
          }
        }
      })
    })
  }
}