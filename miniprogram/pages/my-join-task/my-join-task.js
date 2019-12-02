// miniprogram/pages/my-join-task/my-join-task.js
global._Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskLists: {},
    tabs: [
      {
        title: '未开始',
        status: 1,
      },
      {
        title: '进行中',
        status: 2,
      },
      {
        title: '已完成',
        status: 3,
      },
    ],
    selectTab: 0,
  },
  mapState(state) {

    return {
      pageSize: state.Root.pageSize,
    }
  },
  computed: {
    currentTab() {

      return this.data.tabs[this.data.selectTab]
    },
    currentTask() {

      return this.data.taskLists[this.data.currentTab.status] || {}
    },
    currentTaskList() {
      
      return this.data.currentTask.taskList || []
    },
    currentPage() {

      return this.data.currentTask.page || 1
    },
    currentIsEnd() {

      return this.data.currentTask.isEnd || false
    },
  },
  onPageLoad() {
    this.getData()
  },
  async getData() {
    const { currentTab } = this.data

    if (!this.data.currentTask.taskList) {
      // 如果没有则设置
      await new Promise(resolve => this.setData({
        taskLists: {
          ...this.data.taskLists,
          [currentTab.status]: {
            taskList: [],
            page: 1,
            isEnd: false,
          }
        }
      }, resolve))
    }

    const { currentTaskList: taskList, currentPage: page, currentIsEnd: isEnd, pageSize } = this.data

    if (isEnd) return

    this.$native.call('showLoading', { title: '加载中...' })

    const res = await this.$store.dispatch('Profile/getMyJoinTaskList', { page, pageSize, status: currentTab.status })

    this.$native.call('hideLoading')

    if (res.status !== 200) return this.$native.call('showToast', { title: res.message, icon: 'none' })

    this.setData({
      taskLists: {
        ...this.data.taskLists,
        [currentTab.status]: {
          taskList: taskList.concat(res.data),
          page: page + 1,
          isEnd: res.data.length < pageSize
        }
      }
    })
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