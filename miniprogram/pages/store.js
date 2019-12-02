import native from '../render/native'
import * as rootService from '../services/root'

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
  pageSize: 20, // 全局分页大小

  userInfo: {}, // 用户信息
}

const getters = {

}

const mutations = {
  ['SET_SYSTEM_INFO'](state, info) {

    state.systemInfo = info
  },
  ['SET_USER_INFO'](state, info) {
    state.userInfo = info
  },
}

const actions = {
  async getSystemInfo({ commit, state }) {
    // 获取系统信息
    if (state.systemInfo.system) return state.systemInfo

    const res = await native.call('getSystemInfo')

    commit('Root/SET_SYSTEM_INFO', res)

    return res
  },
  async login({ state, dispatch }, userInfo = {})  {
    // 登录
    //   userInfo.avatarUrl
    //   userInfo.nickName
    //   userInfo.gender // 性别 0：未知、1：男、2：女
    // if (!userInfo) return {}
    
    const { avatarUrl, nickName, gender } = userInfo

    // 用户信息没有变更过
    if (
      state.userInfo.id &&
      state.userInfo.avatarUrl === avatarUrl &&
      state.userInfo.nickName === nickName &&
      state.userInfo.gender === gender
    ) return

    const res = await rootService.login({
      avatarUrl,
      nickName,
      gender,
    })

    if (res.status === 200) return dispatch('Root/getUserInfo', { reset: true })
    else {
      // 用户登录或更新信息失败
      console.error('login', res)

      return state.userInfo
    }
  },
  async getUserInfo({ state, commit }, { reset = false } = {}) {
    // 获取用户信息
    if (state.userInfo.id && !reset) return state.userInfo

    const res = await rootService.getUserInfo()

    if (res.status === 200) {
      commit('Root/SET_USER_INFO', res.data)

      console.log('getUserInfo:', res.data)

      return res.data
    } else return {}
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}