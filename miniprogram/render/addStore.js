import root from '../pages/store'
import home from '../pages/home/store.js'
import taskDetail from '../pages/task-detail/store.js'
import profile from '../pages/profile/store.js'

export default add => {
  // 执行添加
  add('Root', root)
  add('Home', home)
  add('TaskDetail', taskDetail)
  add('Profile', profile)
  
  // 添加完成
  add.end()
}