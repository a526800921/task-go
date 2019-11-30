const { successPayload, failPayload } = require('../utils/utils.js')

module.exports = {
    GET({ db, wxContext }) {
        // 获取用户信息
        const users = db.collection('users')

        return users
            .where({
                id: wxContext.OPENID
            })
            .get()
            .then(res => {
                // 有用户
                if (res.data.length) {
                    const {
                        _id,
                        avatarUrl,
                        nickName,
                        gender,
                    } = res.data[0]

                    return successPayload({
                        id: _id,
                        avatarUrl,
                        nickName,
                        gender,
                    }, '获取成功')
                }
                else return failPayload({}, '用户未注册')
            })
            .catch(err => failPayload(null, `用户信息获取失败：${err.errMsg}`))
    }
}