import {
    addPassenger,
    deletePassenger,
    getPassengers,
    getUserInfo,
    login,
    register,
    updatePassenger,
    updateUserInfo
} from '@/api/user'

const state = {
    userInfo: null,
    isLogin: false,
    passengers: [], // 观演人列表
    categories: [], // 分类列表
}

const mutations = {
    SET_TOKEN(state, token) {
        sessionStorage.setItem('token', token)
        state.isLogin = true
    },
    SET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo
    },
    CLEAR_USER(state) {
        sessionStorage.removeItem('token')
        state.userInfo = {}
        state.isLogin = false
        state.passengers = []
    },
    SET_PASSENGERS(state, passengers) {
        state.passengers = passengers
    },
    SET_CATEGORIES(state, categories) {
        state.categories = categories
    },
}

const actions = {
    // 用户登录
    async login({commit, dispatch}, loginForm) {
        try {
            await login(loginForm)
            const cookies = document.cookie.split(';')

            // 获取cookie中的令牌
            let token = ''
            for (let i = 0; i < cookies.length; i++) {
                let c = cookies[i].trim()
                if (c.startsWith('satoken=')) {
                    token = c.replace('satoken=', '')
                    break
                }
            }
            commit('SET_TOKEN', token)
            commit('SET_USER_INFO', loginForm)
        } catch (error) {
            throw error
        }
    },

    // 用户注册
    async register({commit}, registerForm) {
        try {
            await register(registerForm)
        } catch (error) {
            throw error
        }
    },

    // 获取用户信息
    async getUserInfo() {
        try {
            const response = await getUserInfo()
            return response.content
        } catch (error) {
            throw error
        }
    },

    // 退出登录
    logout({commit}) {
        commit('CLEAR_USER')
    },

    // 获取观演人列表
    async getPassengers({commit}) {
        try {
            const res = await getPassengers()
            console.log(res.content)
            commit('SET_PASSENGERS', res.data || [])
            return res.content
        } catch (error) {
            throw error
        }
    },

    // 添加观演人
    async addPassenger({dispatch}, passenger) {
        try {
            await addPassenger(passenger)
            await dispatch('getPassengers')
        } catch (error) {
            throw error
        }
    },

    // 编辑观演人
    async updatePassenger({dispatch}, passenger) {
        try {
            await updatePassenger(passenger)
            await dispatch('getPassengers')
        } catch (error) {
            throw error
        }
    },

    // 删除观演人
    async deletePassenger({dispatch}, id) {
        try {
            await deletePassenger(id)
            await dispatch('getPassengers')
        } catch (error) {
            throw error
        }
    },
}

const getters = {
    isLogin: state => state.isLogin,
    userInfo: state => state.userInfo,
    passengers: state => state.passengers
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
