// 返回参数
const successPayload = (data = null, message = 'success') => ({ status: 200, data, message })
const failPayload = (data = null, message = 'fail') => ({ status: 201, data, message })

// 删除undefined值
const deleteUndefined = obj => {
  Object.keys(obj).forEach(key => obj[key] === void 0 && (delete obj[key]))

  return obj
}

module.exports = {
  successPayload,
  failPayload,
  deleteUndefined,
}