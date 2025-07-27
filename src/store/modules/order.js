import {createOrder, getOrderList, getOrderDetail, cancelOrder, payOrder} from '@/api/order'

const state = {
    orderList: [],
    currentOrder: {},
    loading: false
}

const mutations = {
    SET_ORDER_LIST(state, list) {
        state.orderList = list
    },
    SET_CURRENT_ORDER(state, order) {
        state.currentOrder = order
    },
    ADD_ORDER(state, order) {
        state.orderList.unshift(order)
    },
    UPDATE_ORDER_STATUS(state, {orderId, status}) {
        const order = state.orderList.find(item => item.id === orderId)
        if (order) {
            order.status = status
        }
    },
    SET_LOADING(state, loading) {
        state.loading = loading
    }
}

const actions = {
    // 创建订单
    async createOrder({commit}, orderData) {
        commit('SET_LOADING', true)
        try {
            const response = await createOrder(orderData)
            commit('ADD_ORDER', response.data)
            return response
        } catch (error) {
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // 获取订单列表
    async getOrderList({commit}, params) {
        commit('SET_LOADING', true)
        try {
            const response = await getOrderList(params)
            commit('SET_ORDER_LIST', response.data)
            return response
        } catch (error) {
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // 获取订单详情
    async getOrderDetail({commit}, orderId) {
        commit('SET_LOADING', true)
        try {
            const response = await getOrderDetail(orderId)
            commit('SET_CURRENT_ORDER', response.data)
            return response
        } catch (error) {
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // 取消订单
    async cancelOrder({commit}, orderId) {
        try {
            await cancelOrder(orderId)
            commit('UPDATE_ORDER_STATUS', {orderId, status: 'cancelled'})
        } catch (error) {
            throw error
        }
    },

    // 支付订单
    async payOrder({commit}, {orderId, paymentMethod}) {
        try {
            const response = await payOrder(orderId, {paymentMethod})
            commit('UPDATE_ORDER_STATUS', {orderId, status: 'paid'})
            return response
        } catch (error) {
            throw error
        }
    }
}

const getters = {
    orderList: state => state.orderList,
    currentOrder: state => state.currentOrder,
    loading: state => state.loading
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
