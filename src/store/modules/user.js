import {getUserInfo, login, register, updateUserInfo} from '@/api/user'
import system from "@/utils/system";

const state = {
    token: system.token,
    userInfo: {},
    isLogin: false
}

const mutations = {
    SET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo
        state.isLogin = true
    },
    CLEAR_USER(state) {
        system.token = ''
        state.userInfo = {}
        state.isLogin = false
    }
}

const actions = {
    // 用户登录
    async login({commit}, loginForm) {
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
            system.token = token
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
    async getUserInfo({commit}) {
        try {
            const response = await getUserInfo()
            commit('SET_USER_INFO', response.data)
            return response
        } catch (error) {
            throw error
        }
    },

    // 更新用户信息
    async updateUserInfo({commit}, userInfo) {
        try {
            const response = await updateUserInfo(userInfo)
            commit('SET_USER_INFO', response.data)
            return response
        } catch (error) {
            throw error
        }
    },

    // 退出登录
    logout({commit}) {
        commit('CLEAR_USER')
    }
}

const getters = {
    isLogin: state => state.isLogin,
    userInfo: state => state.userInfo,
    token: state => state.token
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
