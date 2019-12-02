const verify = require('../utils/verify.js')
const taskDetailStructure = require('../utils/task-detail-structure')
const { successPayload, failPayload } = require('../utils/utils.js')

module.exports = {
    POST({ payload, db, wxContext, log, _ }) {
        // 退出任务
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
                    .catch(err => { log.error({ methods: 'outTask-getTask', err }) })

                if (!taskGet || !taskGet.data.length) return failPayload({ type: 2 }, '退出失败：任务不存在')

                const task = taskGet.data.shift()

                if (task.status !== 1) return failPayload({ type: 3 }, '任务已开始或已结束')

                const now = Date.now()
                const minute = 10
                if (task.startTime > now && task.startTime < now + 1000 * 60 * minute) return failPayload({ type: 4 }, `任务开始前${minute}分钟以内不能退出`)
                if (task.creator === wxContext.OPENID) return failPayload({ type: 7 }, '任务创建者不能退出')

                // 任务可退出
                const usersGet = await taskUsers
                    .where({
                        taskId: id
                    })
                    .get()
                    .catch(err => { log.error({ methods: 'outTask-getTask', err }) })

                if (!usersGet || !usersGet.data.length) return failPayload({ type: 5 }, '退出失败：任务不存在')

                const user = usersGet.data.shift()

                if (!user.peoples.find(item => item.id === wxContext.OPENID)) return failPayload({ type: 6 }, '没有加入该任务')

                // 退出
                return taskUsers
                    .where({
                        taskId: id
                    })
                    .update({
                        data: {
                            peoples: _.pull({
                                id: wxContext.OPENID,
                            })
                        }
                    })
                    .then(res => res.stats.updated > 0 ? successPayload(null, '退出成功') : failPayload({ type: 8 }, '退出失败'))
                    .catch(err => failPayload({ type: 9 }, `退出失败：${err.errMsg}`))

            })
            .catch(msg => failPayload({ type: 1 }, `退出失败：${msg}`))
    }
}