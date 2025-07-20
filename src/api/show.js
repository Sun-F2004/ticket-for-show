import request from '@/utils/request'

// 获取演出列表
export function getShowList(params) {
  return request({
    url: '/show/list',
    method: 'get',
    params
  })
}

// 获取演出详情
export function getShowDetail(id) {
  return request({
    url: `/show/detail/${id}`,
    method: 'get'
  })
}

// 搜索演出
export function searchShows(keyword) {
  return request({
    url: '/show/search',
    method: 'get',
    params: { keyword }
  })
}

// 获取演出分类
export function getShowCategories() {
  return request({
    url: '/show/categories',
    method: 'get'
  })
}

// 获取热门演出
export function getHotShows() {
  return request({
    url: '/show/hot',
    method: 'get'
  })
}

// 获取推荐演出
export function getRecommendedShows() {
  return request({
    url: '/show/recommended',
    method: 'get'
  })
}

// 获取演出场次
export function getShowSessions(showId) {
  return request({
    url: `/show/${showId}/sessions`,
    method: 'get'
  })
}

// 获取座位信息
export function getSeatInfo(sessionId) {
  return request({
    url: `/show/session/${sessionId}/seats`,
    method: 'get'
  })
}

// 锁定座位
export function lockSeats(data) {
  return request({
    url: '/show/lock-seats',
    method: 'post',
    data
  })
}

// 释放座位
export function releaseSeats(data) {
  return request({
    url: '/show/release-seats',
    method: 'post',
    data
  })
} 