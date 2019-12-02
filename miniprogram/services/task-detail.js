import fetch from './index.js'

// 获取任务详情
export const getTaskDetail = data => fetch.get('tasks/getTaskDetail', data)

// 加入任务
export const joinTask = data => fetch.post('tasks/joinTask', data)

// 退出任务
export const outTask = data => fetch.post('tasks/outTask', data)

// 提交任务
export const finishTask = data => fetch.post('tasks/finishTask', data)


