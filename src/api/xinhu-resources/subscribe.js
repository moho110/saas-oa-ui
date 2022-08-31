import request from '@/utils/request'

// 查询订阅管理列表
export function listSubscribe(query) {
  return request({
    url: '/xinhu-resources/subscribe/list',
    method: 'get',
    params: query
  })
}

// 查询订阅管理详细
export function getSubscribe(id) {
  return request({
    url: '/xinhu-resources/subscribe/' + id,
    method: 'get'
  })
}

// 新增订阅管理
export function addSubscribe(data) {
  return request({
    url: '/xinhu-resources/subscribe',
    method: 'post',
    data: data
  })
}

// 修改订阅管理
export function updateSubscribe(data) {
  return request({
    url: '/xinhu-resources/subscribe',
    method: 'put',
    data: data
  })
}

// 删除订阅管理
export function delSubscribe(id) {
  return request({
    url: '/xinhu-resources/subscribe/' + id,
    method: 'delete'
  })
}
