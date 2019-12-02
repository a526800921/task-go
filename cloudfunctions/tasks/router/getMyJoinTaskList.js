const verify = require('../utils/verify.js')
const pageStructure = require('../utils/page-structure.js')
const { successPayload, failPayload } = require('../utils/utils.js')

module.exports = {
    GET({ payload, db, wxContext, _ }) {
        // 获取我参与的任务
        return verify(payload, pageStructure)
            .then(() => {
                const {
                    page = 1,
                    pageSize = 20,
                    status = 1,
                } = payload
                const $ = _.aggregate
                const task_users = db.collection('task_users')

                return task_users
                    .aggregate()
                    .match({
                        peoples: _.elemMatch({ // 找到当前用户参与的
                            id: _.eq(wxContext.OPENID)
                        })
                    })
                    .sort({ // 排序
                        updateTime: -1, // 按更新时间倒序
                    })
                    .skip((page - 1) * pageSize) // 从哪里开始查询
                    .limit(pageSize) // 查询长度
                    .lookup({ // 连表查询
                        from: 'tasks', // 需要连接的表
                        let: { // 变量
                            task_id: '$taskId', // 原表的变量
                            task_status: status, // 状态
                        },
                        pipeline: $.pipeline() // 管道
                            .match( // 查询
                                _.expr( // 查询操作符，用于在查询语句中使用聚合表达式，方法接收一个参数，该参数必须为聚合表达式， 不知道是什么
                                    $.and(
                                        [
                                            $.eq(['$_id', '$$task_id']),
                                            $.eq(['$status', '$$task_status']),
                                        ]
                                    )
                                )
                            )
                            .done(), // 结束
                        as: 'tasks', // 将查到的数据赋值到这个变量名中
                    })
                    .end()
                    .then(res =>
                        successPayload(
                            res.list
                                .filter(item => item.tasks.length)
                                .map(item => {
                                    const task = item.tasks[0]

                                    return {
                                        maxPeople: task.maxPeople,
                                        startTime: task.startTime,
                                        status: task.status,
                                        title: task.title,
                                        id: task._id,
                                        peoples: item.peoples.length,
                                    }
                                }),
                            '查询成功'
                        )
                    )
                    .catch(err => failPayload({ type: 2 }, `查询失败：${err.errMsg}`))
            })
            .catch(msg => failPayload({ type: 1 }, `查询失败：${msg}`))
    }
}