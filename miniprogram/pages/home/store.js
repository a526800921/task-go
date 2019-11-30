import * as homeService from '../../services/home.js'

const state = {
  taskList: [],
  taskPage: 1,
  taskIsEnd: false,  
}

const getters = {

}

const mutations = {
  ['SET_TASK_INFO'](state, { list, page, isEnd }) {

    state.taskList = list
    state.taskPage = page
    state.taskIsEnd = isEnd
  },
}

const actions = {
  async getTaskList({ commit, state, rootState }, { init = false, reset = false } = {}) {
    // 获取任务列表

    // 重置
    if (reset) {
      commit('Home/SET_TASK_INFO', {
        list: [],
        page: 1,
        isEnd: false,
      })
    }

    const { taskList, taskPage, taskIsEnd } = state
    const pageSize = 20

    if (taskList.length && init) return taskList
    if (taskIsEnd) return taskList

    const res = await homeService.getTaskList({
      page: taskPage,
      pageSize,
    })

    if (res.status !== 200) return

    commit('Home/SET_TASK_INFO', {
      list: taskList.concat(res.data),
      page: taskPage + 1,
      isEnd: res.data.length < pageSize,
    })

    return state.taskList
  },
  async addTask(store, params) {
    // 添加任务
    const res = await homeService.addTask({
      title: params.title, // 任务标题
      description: params.description, // 任务描述
      startTime: params.startTime, // 开始时间
      maxPeople: params.maxPeople || 10, // 可加入最大人数
    })

    return res
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}