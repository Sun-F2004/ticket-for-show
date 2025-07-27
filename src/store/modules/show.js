import {getShowList, getShowDetail, searchShows} from '@/api/show'

const state = {
    showList: [],
    showDetail: {},
    searchResults: [],
    loading: false
}

const mutations = {
    SET_SHOW_LIST(state, list) {
        state.showList = list
    },
    SET_SHOW_DETAIL(state, detail) {
        state.showDetail = detail
    },
    SET_SEARCH_RESULTS(state, results) {
        state.searchResults = results
    },
    SET_LOADING(state, loading) {
        state.loading = loading
    }
}

const actions = {
    // 获取演出列表
    async getShowList({commit}, params) {
        commit('SET_LOADING', true)
        try {
            const response = await getShowList(params)
            commit('SET_SHOW_LIST', response.data)
            return response
        } catch (error) {
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // 获取演出详情
    async getShowDetail({commit}, id) {
        commit('SET_LOADING', true)
        try {
            const response = await getShowDetail(id)
            commit('SET_SHOW_DETAIL', response.data)
            return response
        } catch (error) {
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // 搜索演出
    async searchShows({commit}, keyword) {
        commit('SET_LOADING', true)
        try {
            const response = await searchShows(keyword)
            commit('SET_SEARCH_RESULTS', response.data)
            return response
        } catch (error) {
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    }
}

const getters = {
    showList: state => state.showList,
    showDetail: state => state.showDetail,
    searchResults: state => state.searchResults,
    loading: state => state.loading
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
