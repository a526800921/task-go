// 用户值格式
const page = {
    id: 'xx', // 用户id
    createTime: 1574996885094, // 用户创建时间
    updateTime: 1574996885094, // 用户修改信息时间

    avatarUrl: '', // 头像
    nickName: '', // 昵称
    gender: 0, // 性别 0：未知、1：男、2：女
}

const structure = {
    isRequire: false,
    type: 'object',
    nullMessage: '参数为空',
    verifyMessage: '参数格式有误',
    children: {
        ['avatarUrl']: {
            isRequire: false,
            type: 'string',
            nullMessage: '头像不能为空',
            verifyMessage: '头像格式有误',
        },
        ['nickName']: {
            isRequire: false,
            type: 'string',
            nullMessage: '昵称不能为空',
            verifyMessage: '昵称格式有误',
        },
        ['gender']: {
            isRequire: false,
            type: 'number',
            nullMessage: '性别不能为空',
            verifyMessage: '性别格式有误',
        },
    }
}

module.exports = structure