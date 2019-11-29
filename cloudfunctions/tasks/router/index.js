const getTaskList = require('./getTaskList')
const addTask = require('./addTask')

const gather = {
    getTaskList,
    addTask,
}

function getMethod(path, method) {
    // path -> getTaskList
    // method -> GET POST UPDATE DELETE
    const route = gather[path]

    if (route && route[method]) return route[method]

    return null
}

module.exports = getMethod