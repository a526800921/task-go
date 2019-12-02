// 分页值格式
const page = {
  page: 1,
  pageSize: 10,
  status: 1,
}

const structure = {
  isRequire: false,
  type: 'object',
  nullMessage: '参数为空',
  verifyMessage: '参数格式有误',
  children: {
    ['page']: {
      isRequire: true,
      type: 'number',
      nullMessage: 'page不能为空',
      verifyMessage: 'page格式有误',
    },
    ['pageSize']: {
      isRequire: true,
      type: 'number',
      nullMessage: 'pageSize不能为空',
      verifyMessage: 'pageSize格式有误',
    },
    ['status']: {
      isRequire: false,
      type: 'number',
      nullMessage: '状态不能为空',
      verifyMessage: '状态格式有误',
    },
    
  }
}

module.exports = structure