// 每分钟执行一次
// 如果有任务时间到开始时间，则将状态改为进行中
// config.json 中的 name 是云函数的名称
// 需要上传 云函数 及 触发器

// 云函数入口文件
const cloud = require('wx-server-sdk')
const { successPayload, failPayload } = require('./utils')

cloud.init({
  // env: cloud.DYNAMIC_CURRENT_ENV
  env: 'test-pwezf',
  // env: 'prod-eeev0',
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async () => {
  const tasks = db.collection('tasks')

  return tasks
    .where({
      status: 1, // 未开始
      startTime: _.lt(Date.now() + 1000), // 找到开始时间小于现在
    })
    .update({
      data: {
        status: 2, // 将未开始的状态改为进行中
        updateTime: Date.now(),
      }
    })
    .then(res =>
      res.stats.updated > 0 ?
        successPayload(null, `修改成功(个数): ${res.stats.updated}`) :
        successPayload(null, `无需要修改`)
    )
    .catch(err => failPayload(err, `修改失败`))
}