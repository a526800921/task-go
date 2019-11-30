const login = require('./login')
const getUserInfo = require('./getUserInfo')

const gather = {
    login,
    getUserInfo,
}

function getMethod(path, method) {
    // path -> getTaskList
    // method -> GET POST UPDATE DELETE
    const route = gather[path]

    if (route && route[method]) return route[method]

    return null
}

module.exports = getMethod