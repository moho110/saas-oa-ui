import request from '@/utils/request'

// 查询订阅内容信息列表
export function listSubscribeinfo(query) {
  return request({
    url: '/xinhu-resources/subscribeinfo/list',
    method: 'get',
    params: query
  })
}

// 查询订阅内容信息详细
export function getSubscribeinfo(id) {
  return request({
    url: '/xinhu-resources/subscribeinfo/' + id,
    method: 'get'
  })
}

// 新增订阅内容信息
export function addSubscribeinfo(data) {
  return request({
    url: '/xinhu-resources/subscribeinfo',
    method: 'post',
    data: data
  })
}

// 修改订阅内容信息
export function updateSubscribeinfo(data) {
  return request({
    url: '/xinhu-resources/subscribeinfo',
    method: 'put',
    data: data
  })
}

// 删除订阅内容信息
export function delSubscribeinfo(id) {
  return request({
    url: '/xinhu-resources/subscribeinfo/' + id,
    method: 'delete'
  })
}
