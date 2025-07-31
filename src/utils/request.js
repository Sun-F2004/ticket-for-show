import axios from 'axios'

// 创建axios实例
const service = axios.create({
    baseURL: '/api',
    timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token')
        if (token) {
            config.headers['satoken'] = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        if (response.config.responseType !== 'blob' && res.code !== 1) {
            return Promise.reject(new Error(res.message || '请求失败'))
        } else {
            return res
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
