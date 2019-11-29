const verify = require('../utils/verify.js')
const taskStructure = require('../utils/task-structure.js')
const { successPayload, failPayload } = require('../utils/utils.js')

module.exports = {
    POST({ payload, db, wxContext }) {
        // 添加任务
        return verify(payload, taskStructure)
            .then(async () => {
                const now = Date.now()

                if (payload.startTime < now) return Promise.reject('开始时间不能小于当前时间')

                const tasks = db.collection('tasks')

                return tasks.add({
                    data: {
                        status: 1, // 任务状态 1 -> 未开始  2 -> 进行中  3 -> 已完成/已结束
                        creator: wxContext.OPENID, // 任务创建者
                        createTime: now, // 创建时间
                        updateTime: now, // 修改时间

                        title: payload.title, // 任务标题
                        description: payload.description, // 任务描述
                        startTime: payload.startTime, // 开始时间
                        maxPeople: payload.maxPeople || 10, // 可加入最大人数
                    }
                })
                    .then(res => {
                        if (res._id) {
                            // 给关联表task_users添加一条记录
                            const taskUsers = db.collection('task_users')
                            const failCallback = () => {
                                // 关联表添加失败则删除任务
                                tasks.where({ _id: res._id }).remove()
                            }
                            return taskUsers.add({
                                data: {
                                    taskId: res._id,
                                    peoples: [wxContext.OPENID],
                                    createTime: now, // 创建时间
                                    updateTime: now, // 修改时间
                                }
                            })
                                .then(res2 => {
                                    if (res2._id) return successPayload(null, '添加成功')
                                    else {
                                        failCallback()

                                        return failPayload(null, `添加失败：${res2.errMsg}`)
                                    }
                                })
                                .catch(err => {
                                    failCallback()

                                    return failPayload(null, `添加失败：${err.errMsg}`)
                                })
                        } else return failPayload(null, `添加失败：${res.errMsg}`)
                    })
                    .catch(err => failPayload(null, `添加失败：${err.errMsg}`))

            })
            .catch(msg => failPayload(null, `添加失败：${msg}`))
    },
}

