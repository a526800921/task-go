
export default params => (_this, _params, _oldParams) => {
   // 模拟watch
   if (params.watch) {
      const keys = Object.keys(_params)

      for (let i = 0; i < keys.length; i++) {
         const key = keys[i]

         if (_oldParams[key] !== _params[key] && JSON.stringify(_oldParams[key]) !== JSON.stringify(_params[key])) {
            // 值有所改变
            if (typeof params.watch[key] === 'function') {
               try {
                  params.watch[key].apply(_this, [_params[key], _oldParams[key]])
               } catch (err) { console.error(err) }
            }
         }
      }
   }
}