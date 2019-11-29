// 云函数入口文件
const cloud = require('wx-server-sdk')
const getMethod = require('./router')
const { failPayload } = require('./utils/utils.js')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const log = cloud.logger()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('event', event)
  console.log('context', context)
  console.log('wxContext', wxContext)

  const { path, method } = event
  const find = getMethod(path, method)

  if (find) return find({ 
    payload: event.payload, 
    context, 
    wxContext, 
    db, 
    _, 
    log,
  })
  else return failPayload(null, '方法不存在')
}