import request from '@/utils/request'
import {Message} from "element-ui";

// 获取验证码
export function getCaptcha() {
    return request({
        url: '/common/kaptcha/get',
        method: 'post',
        responseType: 'blob'
    })
}

export function validate(captcha) {
    return request({
        url: '/common/kaptcha/validate',
        method: 'post',
        data: {
            "captcha" : captcha
        }
    })
}




// fire 123
