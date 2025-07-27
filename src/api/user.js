import request from '@/utils/request'

// 用户登录
export function login(data) {
    return request({
        url: '/user/user/login',
        method: 'post',
        data: data,
    })
}

// 用户注册
export function register(data) {
    return request({
        url: '/user/register',
        method: 'post',
        data
    })
}

// 获取用户信息
export function getUserInfo() {
    return request({
        url: '/user/info',
        method: 'get'
    })
}

// 更新用户信息
export function updateUserInfo(data) {
    return request({
        url: '/user/update',
        method: 'put',
        data
    })
}

// 修改密码
export function changePassword(data) {
    return request({
        url: '/user/change-password',
        method: 'put',
        data
    })
}

// 发送验证码
export function sendVerificationCode(phone) {
    return request({
        url: '/user/send-code',
        method: 'post',
        data: {phone}
    })
}

// 忘记密码
export function forgotPassword(data) {
    return request({
        url: '/user/forgot-password',
        method: 'post',
        data
    })
}
