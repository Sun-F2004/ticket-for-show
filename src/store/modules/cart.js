import {getCart, addToCart, removeFromCart, updateCartItem} from '@/api/cart'

const state = {
    cartItems: [],
    loading: false
}

const mutations = {
    SET_CART_ITEMS(state, items) {
        state.cartItems = items
    },
    ADD_CART_ITEM(state, item) {
        state.cartItems.push(item)
    },
    REMOVE_CART_ITEM(state, itemId) {
        const index = state.cartItems.findIndex(item => item.id === itemId)
        if (index > -1) {
            state.cartItems.splice(index, 1)
        }
    },
    UPDATE_CART_ITEM(state, {itemId, quantity}) {
        const item = state.cartItems.find(item => item.id === itemId)
        if (item) {
            item.quantity = quantity
        }
    },
    SET_LOADING(state, loading) {
        state.loading = loading
    }
}

const actions = {
    // 获取购物车
    async getCart({commit}) {
        commit('SET_LOADING', true)
        try {
            const response = await getCart()
            commit('SET_CART_ITEMS', response.data)
            return response
        } catch (error) {
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // 添加到购物车
    async addToCart({commit}, cartItem) {
        try {
            const response = await addToCart(cartItem)
            commit('ADD_CART_ITEM', response.data)
            return response
        } catch (error) {
            throw error
        }
    },

    // 从购物车移除
    async removeFromCart({commit}, itemId) {
        try {
            await removeFromCart(itemId)
            commit('REMOVE_CART_ITEM', itemId)
        } catch (error) {
            throw error
        }
    },

    // 更新购物车商品数量
    async updateCartItem({commit}, {itemId, quantity}) {
        try {
            await updateCartItem(itemId, {quantity})
            commit('UPDATE_CART_ITEM', {itemId, quantity})
        } catch (error) {
            throw error
        }
    }
}

const getters = {
    cartItems: state => state.cartItems,
    cartTotal: state => {
        return state.cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity)
        }, 0)
    },
    cartCount: state => {
        return state.cartItems.reduce((count, item) => {
            return count + item.quantity
        }, 0)
    },
    loading: state => state.loading
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
