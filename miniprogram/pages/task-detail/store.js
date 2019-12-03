import * as taskDetailService from '../../services/task-detail.js'

const state = {
  taskDetail: {},
}

const getters = {

}

const mutations = {
  ['SET_TASK_DETAIL'](state, detail) {

    state.taskDetail = detail
  },
}

const actions = {
  async getTaskDetail({ commit }, { id }) {
    // 获取任务详情
    const res = await taskDetailService.getTaskDetail({ id })

    if (res.status !== 200) return {}

    commit('TaskDetail/SET_TASK_DETAIL', res.data)

    return res.data
  },
  async joinTask(store, { id }) {
    // 加入任务
    const res = await taskDetailService.joinTask({ id })

    return res
  },
  async outTask(store, { id }) {
    // 退出任务
    const res = await taskDetailService.outTask({ id })

    return res
  },
  async finishTask(store, { id }) {
    // 提交任务
    const res = await taskDetailService.finishTask({ id })

    return res
  },
  
}

export default {
  state,
  getters,
  mutations,
  actions,
}