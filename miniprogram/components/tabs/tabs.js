// components/tabs/tabs.js
global._Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    },
    current: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  computed: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e) {
      const { index } = e.currentTarget.dataset

      if (index == this.properties.current) return

      this.triggerEvent('subclick', index)
    }
  }
})
