// miniprogram/pages/task-detail/task-detail.js
global._Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  mapState(state) {

    return {
      taskDetail: state.TaskDetail.taskDetail,
    }
  },
  computed: {
    status() {
      // 底部按钮状态
      const now = Date.now()
      const { id, myInfo, startTime, status, maxPeople, peopleList } = this.data.taskDetail

      if (!id) return -1
      // 8 -> 任务未开始 - 任务创建者无法退出
      if (myInfo.iCreated && startTime > now) return 8
      // 9 -> 任务人数已满
      if (!myInfo.hasJoined && startTime > now + 1000 * 60 * 5 && maxPeople === peopleList.length) return 9
      // 1 -> 可加入 - 任务开始前5分钟
      if (!myInfo.hasJoined && startTime > now + 1000 * 60 * 5) return 1
      // 2 -> 可退出 - 任务开始前10分钟
      if (myInfo.hasJoined && startTime > now + 1000 * 60 * 10) return 2
      // 3 -> 任务即将开始 - 任务开始前10分钟以内
      if (startTime > now && startTime < now + 1000 * 60 * 10) return 3

      // 对其他用户而言
      // 4 -> 任务进行中
      if (!myInfo.hasJoined && status === 2) return 4
      // 5 -> 任务已结束
      if (!myInfo.hasJoined && status === 3) return 5
      // 对加入用户而言
      // 6 -> 我已完成任务
      if (myInfo.hasJoined && status === 2 && myInfo.status === 1) return 6
      // 7 -> 等待他人完成
      if (myInfo.hasJoined && status === 2 && myInfo.status !== 1) return 10
      // 7 -> 任务已完成
      if (myInfo.hasJoined && status === 3) return 7

      return -1
    },
    disable() {
      // 底部按钮展示
      const { status } = this.data

      if (status === 2) return 2
      if ([1, 6].indexOf(status) > -1) return 1

      return -1
    },
  },
  async onPageLoad(options) {
    console.log('onPageLoad', options)
    if (!options.id) return this.$router.back()

    this.$native.call('showLoading', { title: '加载中..' })
    await this.getData(options.id)
    this.$native.call('hideLoading')

    console.log(this.data.taskDetail)
  },
  getData(id) {
    return this.$store.dispatch('TaskDetail/getTaskDetail', { id })
  },
  async submit() {
    // 点击按钮
    const { disable, status } = this.data
    if (disable === -1) return
    if (this.submitFlag) return
    this.submitFlag = true

    const { id } = this.data.taskDetail

    this.$native.call('showLoading', { title: '操作中..', mask: true })

    let method = ''
    
    if (status === 1) {
      // 可加入
      method = 'joinTask'
    }
    else if (status === 2) {
      // 可退出
      method = 'outTask'
    }
    else if (status === 6) {
      // 我已完成任务
      method = 'finishTask'
    }

    const res = await this.$store.dispatch(`TaskDetail/${method}`, { id })
    await this.$native.call('hideLoading')
    this.$native.call('showToast', { title: res.message, icon: res.status === 200 ? 'success' : 'none' })
    // 退出成功刷新页面
    if (res.status === 200) await this.getData(id)

    this.submitFlag = false
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