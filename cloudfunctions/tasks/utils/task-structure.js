// task值格式
const task = {
  id: 'xxx', // 任务id
  status: 1, // 任务状态 1 -> 未开始  2 -> 进行中  3 -> 已完成/已结束
  creator: 'openid', // 任务创建者
  createTime: 1574996885094, // 创建时间
  updateTime: 1574996885094, // 修改时间

  title: 'xxx', // 任务标题
  description: 'xxx', // 任务描述
  startTime: 1574996885094, // 开始时间
  maxPeople: 10, // 可加入最大人数
}

const structure = {
  isRequire: true,
  type: 'object',
  nullMessage: '参数为空',
  verifyMessage: '参数格式有误',
  children: {
    ['id']: {
      isRequire: false,
      type: 'string',
      nullMessage: 'id不能为空',
      verifyMessage: 'id格式有误',
    },
    ['title']: {
      isRequire: true,
      type: 'string',
      nullMessage: '任务标题不能为空',
      verifyMessage: '任务标题格式有误',
    },
    ['description']: {
      isRequire: true,
      type: 'string',
      nullMessage: '任务描述不能为空',
      verifyMessage: '任务描述格式有误',
    },
    ['startTime']: {
      isRequire: true,
      type: 'number',
      nullMessage: '开始时间不能为空',
      verifyMessage: '开始时间格式有误',
    },
    ['maxPeople']: {
      isRequire: true,
      type: 'number',
      nullMessage: '可加入人数不能为空',
      verifyMessage: '可加入人数格式有误',
    },
  }
}

module.exports = structure