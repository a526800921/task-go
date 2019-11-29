import root from '../pages/store'
import home from '../pages/home/store.js'

export default add => {
  // 执行添加
  add('Root', root)
  add('Home', home)
  
  // 添加完成
  add.end()
}