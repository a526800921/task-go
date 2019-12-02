import * as profileService from '../../services/profile.js'

const state = {
  
}

const getters = {

}

const mutations = {
  
}

const actions = {
  async getMyCreateTaskList({ rootState }, { page = 1, pageSize = rootState.Root.pageSize } = {}) {
    // 获取我发布的任务
    const res = await profileService.getMyCreateTaskList({ page, pageSize })

    return res
  },
  async getMyJoinTaskList({ rootState }, { page = 1, pageSize = rootState.Root.pageSize, status } = {}) {
    // 获取我参与的任务
    const res = await profileService.getMyJoinTaskList({ page, pageSize, status })

    return res
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}