// 每分钟执行一次
// 如果有任务时间到开始时间，则将状态改为进行中
// config.json 中的 name 是云函数的名称
// 需要上传 云函数 及 触发器

// 云函数入口文件
const cloud = require('wx-server-sdk')
const { successPayload, failPayload } = require('./utils')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async () => {
  const tasks = db.collection('tasks')

  return tasks
    .where({
      status: 1, // 未开始
      startTime: _.lt(Date.now()), // 找到开始时间小于现在
    })
    .get()
    .then(res => {
      if (res.data.length) {
        // 将未开始的状态改为进行中
        const ids = res.data.map(item => item._id)

        return tasks
          .where({
            _id: _.in(ids)
          })
          .update({
            data: {
              status: 2,
              updateTime: Date.now(),
            }
          })
          .then(res =>
            res.stats.updated > 0 ?
              successPayload(ids, `修改成功`) :
              failPayload(ids, `修改失败`)
          )
          .catch(err => failPayload(ids, `修改失败：${err.errMsg}`))
      }
      else return successPayload(null, '无需要修改')
    })
    .catch(err => failPayload(null, `修改失败：${err.errMsg}`))
}