// miniprogram/pages/add-task/add-task.js
global._Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDay: Date.now(), // 开始时间
    endDay: Date.now() + 1000 * 60 * 60 * 24 * 30 * 1, // 现在到一个月之后
    // startTime: Date.now() + 1000 * 60 * 10, // 至少10分钟以后
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