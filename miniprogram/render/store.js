const getters = {}
const addGetters = (name, page) => getters[name] = page.getters
const syncGetters = () => {
  let flag = false

  Object.keys(getters).forEach(name => {
    Object.keys(getters[name]).forEach(key => {
      if (!store.getters[name]) store.getters[name] = {}

      const newValue = getters[name][key](store.state[name], store.getters[name], store.state, store.getters)
      const oldValue = store.getters[name][key]
      
      if (oldValue !== newValue && JSON.stringify(oldValue) !== JSON.stringify(newValue)) flag = true
      store.getters[name][key] = newValue
    })
  })

  // 如果有不同的值，则重新同步，直到所有值都是最后的值
  if (flag) syncGetters()
}

const actions = {}
const addAction = (name, page) => Object.assign(actions, Object.keys(page.actions).reduce((a, key) => {
  a[`${name}/${key}`] = (...arg) => page.actions[key]({ 
    state: store.state[name], 
    rootState: store.state, 
    commit: store.commit, 
    dispatch: store.dispatch, 
    getters: store.getters[name], 
    rootGetters: store.getters,
  }, ...arg)

  return a
}, {}))

const mutations = {}
const mutationHooks = []
const addMutation = (name, page) => Object.assign(mutations, Object.keys(page.mutations).reduce((a, key) => {
  a[`${name}/${key}`] = value => page.mutations[key](store.state[name], value)

  return a
}, {}))


// 同步当前页面数据
const syncData = () => {
  const page = getCurrentPages().pop()
  if (page && (page.mapState || page.mapGetters)) return new Promise(res => page.setData(Object.assign(
    page.mapState ? page.mapState(store.state) : {},
    page.mapGetters ? page.mapGetters(store.getters) : {},
  ), res))
}

let commitTimer = null
const store = {
  state: {},
  getters: {},
  commit: (key, value) => { // 同步操作
    if (mutations[key]) {
      console.time(key)
      // 设置state数据
      mutations[key](value)
      // 设置getters数据
      syncGetters()
      console.timeEnd(key)

      // 当前页面渲染数据同步
      syncData()
      // 手机实在卡的时候再开防抖
      // clearTimeout(commitTimer)
      // commitTimer = setTimeout(() => syncData(), 50)

      // 触发监听函数队列
      mutationHooks.forEach(fn => fn({ type: key, payload: value }))
    } else console.error(`commit 没有找到方法 ${key}`)
  },
  subscribe(fn) {
    // 添加mutations钩子

    mutationHooks.push(fn)
  },
  dispatch: (key, ...arg) => { // 存在异步操作
    if (actions[key]) return actions[key](...arg)
    else console.error(`dispatch 没有找到方法 ${key}`)
  },
}

// 导出整体
export default store

// 添加方法
export const add = (name, page) => {
  // 添加 state
  if (page.state) store.state[name] = page.state
  // 添加 getters
  if (page.getters) addGetters(name, page)
  // 添加 action
  if (page.actions) addAction(name, page)
  // 添加 mutation
  if (page.mutations) addMutation(name, page)
}

// 给添加方法增加完成的回调
add.end = () => {
  // 同步 getters
  syncGetters()
}

export const injectState = params => {
  if (params.mapState || params.mapGetters) {
    // 在页面data里面注入state
    if (params.mapState) {
      const state = params.mapState(store.state)

      Object.keys(state).forEach(key => {
        params.data[key] = state[key]
      })
    }

    // 在页面data里面注入getters
    if (params.mapGetters) {
      const _getters = params.mapGetters(store.getters)

      Object.keys(_getters).forEach(key => {
        params.data[key] = _getters[key]
      })
    }

    // onShow时刷新页面
    const { onShow, onLoad } = params
    params.onLoad = async function(...arg) {
      await syncData()

      return onLoad && onLoad.apply(this, arg)
    }
    params.onShow = async function(...arg) {
      if (this.__onceSync__) await syncData()
      this.__onceSync__ = true // 防止onLoad onShow重复执行

      return onShow && onShow.apply(this, arg)
    }
  }
}
