import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import show from './modules/show'
import cart from './modules/cart'
import order from './modules/order'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        show,
        cart,
        order
    }
})
