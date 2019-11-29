
// 类型校验
const verifyGather = {
  ['string']: str => typeof str === 'string',
  ['number']: num => num === num && typeof num === 'number',
  ['boolean']: bl => typeof bl === 'boolean',
  ['null']: n => n === null,
  ['array']: arr => Array.isArray(arr),
  ['object']: obj => !verifyGather['array'](obj) && typeof obj === 'object',
}

// 值校验
const payloadVerify = (payload, verify, { choosable = false } = {}) => {
  const fn = (a, b) => {
    const isRequire = choosable ? false : b.isRequire

    // 必填
    if (isRequire || a !== void 0) {
      // 格式验证
      if (!verifyGather[b.type](a)) {
        if (!a) return b.nullMessage || '参数不能为空'
        return b.verifyMessage || '参数格式有误'
      }
      // 对象属性验证
      if (b.children) {
        for (const key in b.children) {
          const flag = fn(a[key], b.children[key])
          if (flag !== true) return flag
        }
      }
      // 数组成员验证
      if (b.items) {
        if (b.items.min && a.length < b.items.min) return b.items.minMessage || '参数小于最少传入数量'
        if (b.items.max && a.length > b.items.max) return b.items.maxMessage || '参数大于最多传入数量'
        if (a.length) {
          for (let i = 0; i < a.length; i++) {
            const flag = fn(a[i], {
              isRequire: true,
              type: b.items.type,
              nullMessage: b.items.nullMessage,
              verifyMessage: b.items.verifyMessage,
              children: b.items.children,
            })

            if (flag !== true) return flag
          }
        }
      }
    }

    return true
  }

  return fn(payload, verify)
}

module.exports = (...arg) => {
  const flag = payloadVerify(...arg)

  if (flag === true) return Promise.resolve()
  else return Promise.reject(flag)
}
