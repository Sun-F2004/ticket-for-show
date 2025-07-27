import request from '@/utils/request'

// 获取购物车
export function getCart() {
    return request({
        url: '/cart',
        method: 'get'
    })
}

// 添加到购物车
export function addToCart(data) {
    return request({
        url: '/cart/add',
        method: 'post',
        data
    })
}

// 从购物车移除
export function removeFromCart(itemId) {
    return request({
        url: `/cart/remove/${itemId}`,
        method: 'delete'
    })
}

// 更新购物车商品数量
export function updateCartItem(itemId, data) {
    return request({
        url: `/cart/update/${itemId}`,
        method: 'put',
        data
    })
}

// 清空购物车
export function clearCart() {
    return request({
        url: '/cart/clear',
        method: 'delete'
    })
}

// 批量删除购物车商品
export function batchRemoveFromCart(itemIds) {
    return request({
        url: '/cart/batch-remove',
        method: 'delete',
        data: {itemIds}
    })
}
