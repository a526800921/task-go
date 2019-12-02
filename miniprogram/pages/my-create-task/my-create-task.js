// miniprogram/pages/my-create-task/my-create-task.js
global._Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],
    page: 1,
    isEnd: false,
  },
  mapState(state) {

    return {
      pageSize: state.Root.pageSize,
    }
  },
  onPageLoad() {
    this.getData()
  },
  async getData() {
    const { taskList, page, isEnd, pageSize } = this.data

    if (isEnd) return

    this.$native.call('showLoading', { title: '加载中...' })

    const res = await this.$store.dispatch('Profile/getMyCreateTaskList', { page, pageSize })

    this.$native.call('hideLoading')

    if (res.status !== 200) return this.$native.call('showToast', { title: res.message, icon: 'none' })

    this.setData({
      taskList: taskList.concat(res.data),
      page: page + 1,
      isEnd: res.data.length < pageSize
    })
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})