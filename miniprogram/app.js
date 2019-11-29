//app.js
import render from './render/index.js'

const { store, router, native, _Page, _Component } = render

// 替换 Page 渲染函数
global._Page = _Page
// 替换 Component 渲染函数
global._Component = _Component

App({
  async onLaunch(e) {
    console.log('App onLaunch', e)

    // storage初始化完成
    store.storageReady(async () => {
      // 云开发初始化
      const { env } = store.state.Root
      wx.cloud.init({
        env: env === 'develop' ? 'test-pwezf' : '',
        traceUser: true,
      })

      // 开始走自定义页面生命周期
      store.storeReady()

      // 获取系统信息
      store.dispatch('Root/getSystemInfo')
    })
  },
  onShow(e) {
    console.log('App onShow', e)

    if (e.scene == 1034) {
      // 支付完成返回
      console.log('支付完成返回')

    }
  },
  globalData: {

  }
})
