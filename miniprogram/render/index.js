import _Page from './page.js'
import _Component from './component.js'
import store, { injectState, add } from './store.js'
import addStore from './addStore.js'
import native from './native.js'
import watch from './watch'
import computed from './computed'
import lifecycle from './lifecycle'
import storage from './storage'
import router from './router'

// 添加所需页面的store
addStore(add)

// 添加缓存
store.subscribe(storage)

// 页面方法封装
_Page.use(params => {
  // 生命周期
  lifecycle(params)

  // 在页面data里面注入state
  injectState(params)

  // computed 计算属性
  // 不要在没有mapState的情况下使用computed返回state的值，因为不会刷新
  // watch 监听属性
  // computed 和 watch 都是基于setData做渲染
  computed(params, watch(params))

  // 注入方法
  const { onLoad } = params
  params.onLoad = function (...arg) {
    this.$native = native
    this.$store = store
    this.$router = router

    return onLoad && onLoad.apply(this, arg)
  }
})

// 组件方法封装
_Component.use(params => {
  // 注入方法
  const { created } = params
  params.created = function (...arg) {
    this.$native = native
    this.$store = store
    this.$router = router

    return created && created.apply(this, arg)
  }
})

export default {
  _Page, 
  _Component, 
  native, 
  router, 
  store,
}