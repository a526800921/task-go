// components/login-button/login-button.js
global._Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  
  externalClasses: [
    'subclass',
  ],


  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e) {
      const { userInfo } = e.detail
      
      if (userInfo) this.$store.dispatch('Root/login', userInfo)

      this.triggerEvent('subclick')
    }
  }
})
