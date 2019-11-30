const verify = require('../utils/verify.js')
const userStructure = require('../utils/user-structure.js')
const { successPayload, failPayload } = require('../utils/utils.js')

module.exports = {
    POST({ payload, db, wxContext }) {
        // 登录/注册
        return verify(payload, userStructure)
            .then(async () => {
                const now = Date.now()
                const users = db.collection('users')

                return users
                    .where({
                        id: wxContext.OPENID
                    })
                    .get()
                    .then(res => {
                        if (res.data.length) {
                            // 老用户
                            return users
                                .where({
                                    id: wxContext.OPENID
                                })
                                .update({
                                    data: {
                                        updateTime: now, // 用户修改信息时间

                                        avatarUrl: payload.avatarUrl || '', // 头像
                                        nickName: payload.nickName || `用户_${(now + '').slice(-4)}`, // 昵称
                                        gender: payload.gender || 0, // 性别 0：未知、1：男、2：女
                                    }
                                })
                                .then(res => res.stats.updated > 0)
                        } else {
                            // 新用户
                            return users
                                .add({
                                    data: {
                                        id: wxContext.OPENID, // 用户id
                                        createTime: now, // 用户创建时间
                                        updateTime: now, // 用户修改信息时间

                                        avatarUrl: payload.avatarUrl || '', // 头像
                                        nickName: payload.nickName || `用户_${(now + '').slice(-4)}`, // 昵称
                                        gender: payload.gender || 0, // 性别 0：未知、1：男、2：女
                                    }
                                })
                                .then(res => !!res._id)
                        }
                    })
                    .then(res => res ? successPayload(null, '登录/注册成功') : failPayload(null, '登录/注册失败'))
                    .catch(err => failPayload(null, `登录/注册失败：${err.errMsg}`))
            })
            .catch(msg => failPayload(null, `登录/注册失败：${msg}`))
    },
}