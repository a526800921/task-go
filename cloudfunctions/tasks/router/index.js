const getTaskList = require('./getTaskList')
const addTask = require('./addTask')
const getTaskDetail = require('./getTaskDetail')
const joinTask = require('./joinTask')
const outTask = require('./outTask')
const finishTask = require('./finishTask')
const getMyCreateTaskList = require('./getMyCreateTaskList')
const getMyJoinTaskList = require('./getMyJoinTaskList')

const gather = {
    getTaskList,
    addTask,
    getTaskDetail,
    joinTask,
    outTask,
    finishTask,
    getMyCreateTaskList,
    getMyJoinTaskList,
}

function getMethod(path, method) {
    // path -> getTaskList
    // method -> GET POST UPDATE DELETE
    const route = gather[path]

    if (route && route[method]) return route[method]

    return null
}

module.exports = getMethod