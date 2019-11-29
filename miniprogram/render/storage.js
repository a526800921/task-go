import native from './native'
import store from './store'

const types = [
   'Root/SET_SYSTEM_INFO', // 系统设备信息
]

// 给store挂载一个初始数据加载完成的生命周期
let loadEnd = false
const storageReadys = []
store.storageReady = callback => {

   if (loadEnd) callback(store)
   else storageReadys.push(callback)
}

// 初始化store数据
let typeCount = 0
types.forEach(async type => {
   const res = await native.call('getStorage', { key: type }).catch(() => ({ code: 404 }))

   if (res.code === 404) {}
   else store.commit(type, res.data)

   typeCount++
   if (typeCount === types.length) {
      // 全部store数据都赋值完毕
      loadEnd = true
      storageReadys.splice(0, storageReadys.length).forEach(fn => fn())
   }
})

// 将需要缓存的store数据进行缓存
export default ({ type, payload }) => {
   const find = types.find(_type => _type === type)

   if (find) {
      if (payload === void 0) native.call('removeStorage', { key: type })
      else native.call('setStorage', { key: type, data: payload })
   }
}
