// miniprogram/pages/add-task/add-task.js
global._Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDay: Date.now(), // 开始时间
    endDay: Date.now() + 1000 * 60 * 60 * 24 * 30 * 1, // 现在到一个月之后
    // startTime: Date.now() + 1000 * 60 * 10, // 至少10分钟以后

    formData: {
      title: '',
      description: '',
      startTime: 0,
      maxPeople: 10,
    },
    day: '',
    time: '',
  },
  computed: {
    disable() {
      const { title, description, startTime, maxPeople } = this.data.formData

      return !title || !description || !startTime || !maxPeople 
    },
  },

  titleBlur(e) {
    // 标题
    const { value } = e.detail

    this.setData({
      'formData.title': value || ''
    })
  },
  descBlur(e) {
    // 描述
    const { value } = e.detail

    this.setData({
      'formData.description': value || ''
    })
  },
  dayChange(e) {
    // 年月日 "2019-11-30"
    const { value } = e.detail

    this.setData({ day: value || '' })
    this.verifyTime()
  },
  timeChange(e) {
    // 时分 "00:00"
    const { value } = e.detail

    this.setData({ time: value || '' })
    this.verifyTime()
  },
  verifyTime() {
    // 验证时间，至少超出现在时间10分钟
    const { day, time } = this.data
    
    if (!day || !time) return false

    const start = (new Date(`${day} ${time}:00`.replace(/-/g, '/'))).getTime()
    const flag = start > (Date.now() + 1000 * 60 * 10)

    if (!flag) this.$native.call('showToast', { title: '任务开始时间至少在10分钟以后', icon: 'none' })
    
    this.setData({ 'formData.startTime': flag ? start : 0 })
    
    return flag
  },
  peopleChange(e) {
    // 人数
    const { value } = e.detail

    this.setData({
      'formData.maxPeople': value || 10
    })
  },
  async submit() {
    // 发布
    if (this.data.disable) return
    if (this.submitFlag) return
    this.submitFlag = true

    this.$native.call('showLoading', { title: '发布中..', mask: true })

    const { title, description, startTime, maxPeople } = this.data.formData
    const res = await this.$store.dispatch('Home/addTask', {
        title,
        description,
        startTime,
        maxPeople,
    })

    await this.$native.call('hideLoading')

    if (res.status !== 200) {
      // 发布失败
      this.submitFlag = false
      this.$native.call('showToast', { title: `发布失败：${res.message}`, icon: 'none' })
    } else {
      // 成功
      this.$native.call('showToast', { title: `发布成功`, icon: 'success' })
      // 刷新首页数据
      this.$store.dispatch('Home/getTaskList', { reset: true })
      // 返回
      setTimeout(() => this.$router.back(), 2000)
    }
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