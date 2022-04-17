const crypto = require('crypto')
const secret = 'album_2022_04'
const algorithm = 'aes-256-cbc'
function encode(id) {
  const encoder = crypto.createDecipheriv(algorithm, secret)
  const str = [id, Date.now(), 'album2022'].join('|')
  let encrypted = encoder.update(str, 'utf8', 'hex')
  encrypted += encoder.final('hex')
  return encrypted
}

function decode(str) {
  const decoder = crypto.createDecipheriv(algorithm, secret)
  let decoded = decoder.update(str, 'hex', 'utf8')
  decoded += decoder.final('utf8')
  const arr = decoded.split('|')
  return {
    id: arr[0],
    timespan: parseInt(arr[1])
  }
}

// 生成二维码
function encodeErCode() {
  return encode(Math.random())
}

module.exports = {
  encode,
  decode,
  encodeErCode,
}