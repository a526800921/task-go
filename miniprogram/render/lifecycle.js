import store from './store'

let ready = false
const readys = []
const runReady = fn => {

   if (ready) fn()
   else readys.push(fn)
}

store.storeReady = () => {
   // store准备完毕，告知页面可以进行生命周期
   ready = true
   readys.splice(0, readys.length).forEach(fn => fn())
}

export default page => {
   const { onLoad, onShow, onShareAppMessage } = page

   page.onLoad = function (...arg) {
      this.onPageLoad && runReady(this.onPageLoad.bind(this, ...arg))

      return onLoad && onLoad.apply(this, arg)
   }

   page.onShow = function () {
      this.onPageShow && runReady(this.onPageShow.bind(this))

      return onShow && onShow.apply(this)
   }

   page.onShareAppMessage = function () {

      return {
         title: '',
         path: `/pages/home/home`,
      }
   }
}