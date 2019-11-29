export default (params, cb) => {
   // 将computed注入data
   Object.keys(params.computed || {}).forEach(key => {

      try {
         const value = params.computed[key].call(params)

         params.data[key] = value
      } catch (error) { console.error(error) }
   })

   // 模拟computed
   const onLoad = params.onLoad
   params.onLoad = function (...arg) {
      const setData = this.setData
      this.setData = function (_params, callback) {
         
         // 获取旧的值
         const getOldData = target => Object.keys(target).reduce((a, key) => {
            a[key] = this.data[key]

            return a
         }, {})

         // 获取旧的data的值
         const oldValueUseWatch = getOldData(_params)

         const _callback = (..._arg) => {

            if (params.computed) {
               // 获取旧的computed的值
               const oldComputedUseWatch = getOldData(params.computed)

               // 获取computed计算后的值
               const getComputed = (lastData = {}) => {
                  let flag = false

                  Object.keys(params.computed).forEach(key => {
                     try {
                        if (lastData[key] === void 0) lastData[key] = this.data[key] || null

                        const oldValue = lastData[key]
                        const newValue = params.computed[key].call(this)
   
                        lastData[key]  = this.data[key] = newValue
                        
                        // 检测computed间相互引用
                        if (oldValue !== newValue && JSON.stringify(oldValue) !== JSON.stringify(newValue)) flag = true
                     } catch (error) { console.error(error) }
                  })

                  if (flag) return getComputed(lastData)

                  return lastData
               }

               const computed = getComputed()

               setData.apply(this, [computed, () => cb(this, { ..._params, ...computed }, { ...oldValueUseWatch, ...oldComputedUseWatch })])
            } else cb(this, _params, oldValueUseWatch)

            return callback && callback.apply(this, _arg)
         }

         return setData.apply(this, [_params, _callback])
      }

      return onLoad && onLoad.apply(this, arg)
   }
}