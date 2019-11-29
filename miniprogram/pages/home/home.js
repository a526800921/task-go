// pages/home/home.js
global._Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  mapState(state) {

    return {
      taskList: state.Home.taskList,
      taskIsEnd: state.Home.taskIsEnd,
    }
  },

  async getData({ init = false, reset = false } = {}) {
    this.$native.call('showLoading', { title: '加载中...' })

    const res = await this.$store.dispatch('Home/getTaskList', { init, reset })

    this.$native.call('hideLoading')

    return res
  },
  async onPageLoad(options) {
    console.log('onPageLoad', options)

    this.getData({ init: true })
  },

  onPageShow() {
    console.log('onPageShow')
  },

  goAdd() {
    // 去发布
    this.$router.push('/pages/add-task/add-task')
  },
  goTaskDetail(e) {
    // 去任务详情页
    const { id } = e.currentTarget.dataset

    this.$router.push(`/pages/task-detail/task-detail?id=${id}`)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    await this.getData({ reset: true })

    this.$native.call('stopPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.taskIsEnd) return
    
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})