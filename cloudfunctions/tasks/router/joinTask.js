const verify = require('../utils/verify.js')
const taskDetailStructure = require('../utils/task-detail-structure')
const { successPayload, failPayload } = require('../utils/utils.js')

module.exports = {
    POST({ payload, db, log, wxContext, _ }) {
        // 加入任务
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
                    .catch(err => { log.error({ methods: 'joinTask-getTask', err }) })
                
                if (!taskGet || !taskGet.data.length) return failPayload({ type: 1 }, '加入失败：任务不存在')
                
                const task = taskGet.data.shift()

                if (task.status !== 1) return failPayload({ type: 2 }, '任务已开始或已结束')

                const now = Date.now()
                const minute = 5
                if (task.startTime > now && task.startTime < now + 1000 * 60 * minute) return failPayload({ type: 3 }, `任务开始前${minute}分钟以内无法加入`)
                if (task.creator === wxContext.OPENID) return failPayload({ type: 9 }, '已加入任务')

                // 任务可加入
                const usersGet = await taskUsers
                    .where({
                        taskId: id
                    })
                    .get()
                    .catch(err => { log.error({ methods: 'joinTask-getTask', err }) })

                if (!usersGet || !usersGet.data.length) return failPayload({ type: 4 }, '加入失败：任务不存在')

                const user = usersGet.data.shift()

                if (user.peoples.find(item => item.id === wxContext.OPENID)) return failPayload({ type: 5 }, '已加入任务')
                
                // 加入
                return taskUsers
                    .where({
                        taskId: id
                    })
                    .update({
                        data: {
                            peoples: _.push({
                                id: wxContext.OPENID,
                                status: 1,
                            })
                        }
                    })
                    .then(res => res.stats.updated > 0 ? successPayload(null, '加入成功') : failPayload({ type: 6 }, '加入失败'))
                    .catch(err => failPayload({ type: 7 }, `加入失败：${err.errMsg}`))
            })
            .catch(msg => failPayload({ type: 8 }, `加入失败：${msg}`))
    }
}