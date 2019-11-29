// 请求
import store from '../render/store'

const fetch = function (method = 'GET', url = '', data = {}, options = {}) {
  const index = url.indexOf('/')
  const name = url.slice(0, index)
  const path = url.slice(index + 1)

  return wx.cloud.callFunction({
    name,
    data: {
      method,
      path,
      payload: data,
    }
  })
}

const response = function (fn, count = 3) {

  return fn().then(res => {

    return res.result || {}
  }).catch(err => {
    // 接口报错
    console.error(err)

    return count <= 1 ? {
      status: 202,
      data: null,
      message: err.errMsg,
      error: err,
    } : response(fn, count - 1)
  })
}

export default {
  get: (url, data, options) => response(() => fetch('GET', url, data, options)),
  post: (url, data, options) => response(() => fetch('POST', url, data, options)),
}