import request from '@/utils/request'

// 获取验证码
export function getCaptcha() {
    return request({
        url: '/common/kaptcha/get',
        method: 'post',
        responseType: 'blob'
    })
}

// 校验验证码
export function validate(captcha) {
    return request({
        url: '/common/kaptcha/validate',
        method: 'post',
        data: {
            "captcha": captcha
        }
    })
}
