
const hooks = []

const _Component = params => {
  // 处理数据
  hooks.forEach(fn => fn(params))

  return Component(params)
}

_Component.use = fn => hooks.push(fn)

export default _Component