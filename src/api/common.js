import request from '@/utils/request'
import {Message} from "element-ui";

// 获取验证码
export function getCaptcha() {
    return request({
        url: '/common/kaptcha/get',
        method: 'post'
    }).catch(err => {
        Message.error(err)
    })
}

// fire 123
