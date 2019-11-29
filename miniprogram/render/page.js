
const hooks = []

const _Page = params => {
  // 处理数据
  hooks.forEach(fn => fn(params))

  return Page(params)
}

_Page.use = fn => hooks.push(fn) 

export default _Page