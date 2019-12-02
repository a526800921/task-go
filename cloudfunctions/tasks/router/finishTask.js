const verify = require('../utils/verify.js')
const taskDetailStructure = require('../utils/task-detail-structure')
const { successPayload, failPayload } = require('../utils/utils.js')

module.exports = {
    POST({ payload, db, wxContext, log }) {
        // 完成任务
        return verify(payload, taskDetailStructure)
            .then(async () => {
                const { id } = payload
                const tasks = db.collection('tasks')
                const taskUsers = db.collection('task_users')

                const taskGet = await tasks
                    .where({
                        _id: id
                    })
                    .get()
                    .catch(err => { log.error({ methods: 'finishTask-getTask', err }) })

                if (!taskGet || !taskGet.data.length) return failPayload({ type: 2 }, '提交任务失败：任务不存在')

                const task = taskGet.data.shift()

                if (task.status !== 2) return failPayload({ type: 3 }, '任务未开始或已结束')

                // 任务可提交
                const usersGet = await taskUsers
                    .where({
                        taskId: id
                    })
                    .get()
                    .catch(err => { log.error({ methods: 'finishTask-getTask', err }) })

                if (!usersGet || !usersGet.data.length) return failPayload({ type: 4 }, '提交任务失败：任务不存在')

                const user = usersGet.data.shift()
                const index = user.peoples.findIndex(item => item.id === wxContext.OPENID)
                const my = user.peoples[index]

                if (!my) return failPayload({ type: 5 }, '没有加入该任务')
                if (my.status !== 1) return failPayload({ type: 6 }, '任务已提交过')

                // 当前用户是否是最后一个提交的用户
                // 如果是，则更新任务状态
                const isLast = user.peoples.filter(item => item.status !== 1).length === user.peoples.length - 1

                // 提交
                return taskUsers
                    .where({
                        taskId: id
                    })
                    .update({
                        data: {
                            [`peoples.${index}.status`]: 2
                        }
                    })
                    .then(res => {
                        if (res.stats.updated > 0) {
                            if (isLast) {
                                return tasks
                                    .where({
                                        _id: id,
                                    })
                                    .update({
                                        data: {
                                            status: 3,
                                            updateTime: Date.now()
                                        }
                                    })
                                    .then(res2 => res2.stats.updated > 0)
                                    .catch(err => { log.error({ methods: 'finishTask-setTask', err }) })
                                    .then(res2 => {
                                        if (res2) return successPayload(null, '提交任务成功')
                                        else {
                                            // 任务提交失败则还原 task_users 的更新
                                            taskUsers
                                                .where({
                                                    taskId: id
                                                })
                                                .update({
                                                    data: {
                                                        [`peoples.${index}.status`]: 1
                                                    }
                                                })

                                            return failPayload({ type: 9 }, '提交任务失败')
                                        }
                                    })

                            } else return successPayload(null, '提交任务成功')
                        } else return failPayload({ type: 7 }, '提交任务失败')
                    })
                    .catch(err => failPayload({ type: 8 }, `提交任务失败：${err.errMsg}`))

            })
            .catch(msg => failPayload({ type: 1 }, `提交任务失败：${msg}`))
    }
}