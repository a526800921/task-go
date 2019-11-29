import native from '../render/native'

let env = 'develop'

if (typeof __wxConfig == "object") {
  let version = __wxConfig.envVersion;
  console.log("当前环境:" + version)
  if (version == "develop") {
    //工具或者真机 开发环境
    env = 'develop'
  } else if (version == "trial") {
    //测试环境(体验版)
    env = 'trial'
  } else if (version == "release") {
    //正式环境
    env = 'release'
  }
}

const state = {
  env,
  systemInfo: {}, // 设备信息
  pageSize: 10, // 全局分页大小

  test: 0,
}

const getters = {
  test(state) {

    return state.test / 2
  }
}

const mutations = {
  ['SET_SYSTEM_INFO'](state, info) {

    state.systemInfo = info
  },
  ['SET_TEST'](state) {

    state.test++
  }
}

const actions = {
  async getSystemInfo({ commit, state }) {
    // 获取系统信息
    if (state.systemInfo.system) return state.systemInfo

    const res = await native.call('getSystemInfo')

    commit('Root/SET_SYSTEM_INFO', res)

    return res
  },
  setTest({ commit }) {

    commit('Root/SET_TEST')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}