import fetch from './index.js'

// 获取任务列表
export const getTaskList = data => fetch.get('tasks/getTaskList', data)

// 添加任务
export const addTask = data => fetch.post('tasks/addTask', data)
