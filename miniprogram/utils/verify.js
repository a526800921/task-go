// 手机格式验证
export const phoneVerify = phone => /^1\d{10}$/.test(phone)

// 纯数字验证
export const numberVerify = num => /^\d+$/.test(num)

// 邮箱验证
export const emailVerify = email => /^\w+\@\w+\.\w+$/.test(email)

// 金额格式验证
export const moneyVerify = money => /^\d+(\.\d\d?)?$/.test(money)
