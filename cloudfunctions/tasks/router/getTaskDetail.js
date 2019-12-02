const verify = require('../utils/verify.js')
const taskDetailStructure = require('../utils/task-detail-structure')
const { successPayload, failPayload } = require('../utils/utils.js')

module.exports = {
    GET({ payload, db, _, wxContext }) {
        // 获取任务详情

        return verify(payload, taskDetailStructure)
            .then(() => {
                const { id } = payload
                const $ = _.aggregate
                const tasks = db.collection('tasks')

                return tasks
                    .aggregate()
                    .match({
                        _id: id,
                    })
                    .lookup({ // 连表查询任务相关
                        from: 'task_users',
                        let: {
                            task_id: '$_id',
                        },
                        pipeline: $.pipeline()
                            .match(
                                _.expr(
                                    $.eq(['$taskId', '$$task_id'])
                                )
                            )
                            .project({
                                _id: 0,
                                peoples: 1,
                            })
                            .done(),
                        as: 'task_users'
                    })
                    .replaceRoot({
                        newRoot: $.mergeObjects([
                            '$$ROOT',
                            $.arrayElemAt(['$task_users', 0])
                        ])
                    })
                    .lookup({ // 连表查询任务相关人员
                        from: 'users',
                        let: {
                            peoples: '$peoples'
                        },
                        pipeline: $.pipeline()
                            .match(
                                _.expr(
                                    $.in(['$id', $.map({
                                        input: '$$peoples',
                                        in: '$$this.id'
                                    })])
                                )
                            )
                            .project({
                                _id: 0,
                                avatarUrl: 1,
                                id: 1,
                                nickName: 1,
                            })
                            .done(),
                        as: 'users'
                    })
                    // 筛选放到js中执行，这里执行速度慢
                    // .addFields({
                    //     userList: $.map({
                    //         input: '$users',
                    //         in: $.mergeObjects([
                    //             '$$this',
                    //             $.arrayElemAt([
                    //                 '$peoples',
                    //                 $.indexOfArray([
                    //                     $.map({
                    //                         input: '$peoples',
                    //                         as: 'that',
                    //                         in: '$$that.id'
                    //                     }),
                    //                     '$$this.id'
                    //                 ])
                    //             ])
                    //         ])
                    //     })
                    // })
                    // .project({
                    //     _id: 0,
                    //     id: '$_id',
                    //     creatorInfo: $.arrayElemAt([
                    //         '$userList',
                    //         $.indexOfArray([
                    //             $.map({
                    //                 input: '$userList',
                    //                 in: '$$this.id'
                    //             }),
                    //             '$creator'
                    //         ])
                    //     ]),
                    //     description: 1,
                    //     maxPeople: 1,
                    //     startTime: 1,
                    //     status: 1,
                    //     title: 1,
                    //     updateTime: 1,
                    //     userList: 1,
                    // })
                    .end()
                    .then(res => {
                        const data = res.list.shift()

                        if (data) {
                            const userList = data.users.map(item => {
                                const find = data.peoples.find(item2 => item2.id === item.id)

                                return Object.assign(item, find)
                            })
                            const creatorInfo = userList.find(item => item.id === data.creator)
                            const hasJoined = userList.find(item => item.id === wxContext.OPENID)

                            const lastData = {
                                id: data._id,
                                creatorInfo: { // 创建者信息
                                    avatarUrl: creatorInfo.avatarUrl,
                                    nickName: creatorInfo.nickName,
                                },
                                description: data.description,
                                maxPeople: data.maxPeople,
                                createTime: data.createTime,
                                startTime: data.startTime,
                                status: data.status,
                                title: data.title,
                                updateTime: data.updateTime,
                                peopleList: userList.map(item => { // 加入的用户信息
                                    const { id, ...other } = item

                                    return other
                                }),
                                myInfo: {
                                    hasJoined: !!hasJoined, // 当前用户是否已加入任务
                                    status: (hasJoined || { status: -1 }).status, // 当前用户的状态
                                    iCreated: data.creator === wxContext.OPENID, // 是否是当前用户创建的任务
                                },
                            }

                            return successPayload(lastData, '查询成功')
                        } else return failPayload(null, '查询失败：没有该任务')
                    })
                    .catch(err => failPayload(null, `查询失败：${err.errMsg}`))


            })
            .catch(msg => failPayload(null, `查询失败：${msg}`))
    }
}