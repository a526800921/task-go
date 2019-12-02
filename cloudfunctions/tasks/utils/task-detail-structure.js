// task值格式
const task = {
  id: 'xxx', // 任务id
}

const structure = {
  isRequire: true,
  type: 'object',
  nullMessage: '参数为空',
  verifyMessage: '参数格式有误',
  children: {
    ['id']: {
      isRequire: true,
      type: 'string',
      nullMessage: 'id不能为空',
      verifyMessage: 'id格式有误',
    },
  }
}

module.exports = structure