import fetch from './index.js'

// 获取我发布的任务
export const getMyCreateTaskList = data => fetch.get('tasks/getMyCreateTaskList', data)

// 获取我参与的任务
export const getMyJoinTaskList = data => fetch.get('tasks/getMyJoinTaskList', data)

