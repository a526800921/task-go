const verify = require('../utils/verify.js')
const pageStructure = require('../utils/page-structure.js')
const { successPayload, failPayload } = require('../utils/utils.js')

module.exports = {
    GET({ payload, db, _, log }) {
        // 分页获取任务列表
        return verify(payload, pageStructure)
            .then(async () => {
                const {
                    page = 1,
                    pageSize = 10,
                    status = 1,
                } = payload
                const $ = _.aggregate
                const tasks = db.collection('tasks')
                const list = await tasks
                    .aggregate() // 聚合
                    .match({ // 查询条件
                        status,
                    })
                    .sort({ // 排序
                        updateTime: -1, // 按更新时间倒序
                    })
                    .skip((page - 1) * pageSize) // 从哪里开始查询
                    .limit(pageSize) // 查询长度
                    .lookup({ // 连表查询
                        from: 'task_users', // 需要连接的表
                        let: { // 变量
                            task_id: '$_id' // 原表的变量
                        },
                        pipeline: $.pipeline() // 管道
                            .match( // 查询
                                _.expr( // 查询操作符，用于在查询语句中使用聚合表达式，方法接收一个参数，该参数必须为聚合表达式， 不知道是什么
                                    $.eq(['$taskId', '$$task_id']) // 相等，这里的 $taskId 是被连接表的字段
                                )
                            )
                            .project({ // 输出设置
                                _id: 0, // 删除id
                                peoples: $.size('$peoples'), // 计算数组长度
                            })
                            .done(), // 结束
                        as: 'users', // 将查到的数据赋值到这个变量名中
                    })
                    .replaceRoot({ // 重写根对象
                        newRoot: $.mergeObjects( // 合并对象
                            [
                                '$$ROOT', // 原根对象
                                $.arrayElemAt(['$users', 0]) // 拿到 users 数组的第一项
                            ]
                        )
                    })
                    .project({ // 输出设置
                        users: 0 // 删除users字段
                    })
                    .end() // 结束
                    // .get()
                    .catch(err => { log.error({ method: 'GET', err }) })

                if (!list) return failPayload(null, '查询失败')
                else return successPayload(list.list.map(item => {

                    return item
                }))
            })
            .catch(msg => failPayload(null, `查询失败：${msg}`))
    },
}