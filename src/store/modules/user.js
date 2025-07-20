import { login, register, getUserInfo, updateUserInfo } from '@/api/user'

const state = {
  token: localStorage.getItem('token') || '',
  userInfo: {},
  isLogin: false
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    state.isLogin = true
  },
  CLEAR_USER(state) {
    state.token = ''
    state.userInfo = {}
    state.isLogin = false
    localStorage.removeItem('token')
  }
}

const actions = {
  // 用户登录
  async login({ commit }, loginForm) {
    try {
      const response = await login(loginForm)
      commit('SET_TOKEN', response.data.token)
      commit('SET_USER_INFO', response.data.userInfo)
      return response
    } catch (error) {
      throw error
    }
  },

  // 用户注册
  async register({ commit }, registerForm) {
    try {
      const response = await register(registerForm)
      return response
    } catch (error) {
      throw error
    }
  },

  // 获取用户信息
  async getUserInfo({ commit }) {
    try {
      const response = await getUserInfo()
      commit('SET_USER_INFO', response.data)
      return response
    } catch (error) {
      throw error
    }
  },

  // 更新用户信息
  async updateUserInfo({ commit }, userInfo) {
    try {
      const response = await updateUserInfo(userInfo)
      commit('SET_USER_INFO', response.data)
      return response
    } catch (error) {
      throw error
    }
  },

  // 退出登录
  logout({ commit }) {
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