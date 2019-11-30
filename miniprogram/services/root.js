import fetch from './index.js'

// 登录
export const login = data => fetch.post('users/login', data)

// 获取用户信息
export const getUserInfo = data => fetch.get('users/getUserInfo', data)

