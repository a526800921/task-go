// miniprogram/pages/profile.js
global._Page({

  /**
   * 页面的初始数据
   */
  data: {
    menus: [
      {
        title: '我发布的任务',
        path: '/pages/my-create-task/my-create-task'
      },
      {
        title: '我参与的任务',
        path: '/pages/my-join-task/my-join-task'
      },
    ]
  },
  goPage(e) {
    const { path } = e.currentTarget.dataset.item

    if (path) this.$router.push(path)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})