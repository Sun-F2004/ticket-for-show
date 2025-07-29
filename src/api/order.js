import request from '@/utils/request'


export function confirm(data) {
    return request({
        url: '/order/order/confirm',
        method: 'post',
        data
    })
} 

export function pay(data) {
        return request({
        url: '/order/order/pay',
        method: 'post',
        data
    })
}

export function orderPage(data) {
    return request({
        url: '/order/order/page',
        method: 'post',
        data
    })
}


// // 创建订单
// export function createOrder(data) {
//     return request({
//         url: '/order/create',
//         method: 'post',
//         data
//     })
// }

// // 获取订单列表
// export function getOrderList(params) {
//     return request({
//         url: '/order/list',
//         method: 'get',
//         params
//     })
// }

// // 获取订单详情
// export function getOrderDetail(orderId) {
//     return request({
//         url: `/order/detail/${orderId}`,
//         method: 'get'
//     })
// }

// // 取消订单
// export function cancelOrder(orderId) {
//     return request({
//         url: `/order/cancel/${orderId}`,
//         method: 'put'
//     })
// }

// // 支付订单
// export function payOrder(orderId, data) {
//     return request({
//         url: `/order/pay/${orderId}`,
//         method: 'post',
//         data
//     })
// }

// // 确认收货
// export function confirmOrder(orderId) {
//     return request({
//         url: `/order/confirm/${orderId}`,
//         method: 'put'
//     })
// }

// // 申请退款
// export function refundOrder(orderId, data) {
//     return request({
//         url: `/order/refund/${orderId}`,
//         method: 'post',
//         data
//     })
// }

// // 获取支付方式
// export function getPaymentMethods() {
//     return request({
//         url: '/order/payment-methods',
//         method: 'get'
//     })
// }

// // 获取订单统计
// export function getOrderStats() {
//     return request({
//         url: '/order/stats',
//         method: 'get'
//     })
// }
