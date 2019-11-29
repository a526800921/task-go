export default {
  call(key, params, ...other) {
    // 调用API Promise 化
    return new Promise((resolve, reject) => {
      try {
        wx[key]({
          ...params,
          success: (...res) => {
            
            if (res.length > 1) resolve(res)
            else resolve(res[0])
          },
          fail: (...err) => {

            if (err.length > 1) reject(err)
            else reject(err[0])
          }
        })
      } catch (error) {
        console.error('API有误：', error)

        reject(error)
      }
    })
  }
}