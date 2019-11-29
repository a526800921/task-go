import native from './native'

export default {
  switchTab(url) {

    return native.call('switchTab', { url })
  },
  reLaunch(url) {

    return native.call('reLaunch', { url })
  },
  push(url) {

    return native.call('navigateTo', { url })
  },
  replace(url) {

    return native.call('redirectTo', { url })
  },
  back(delta = 1) {

    return native.call('navigateBack', { delta })
  }
}