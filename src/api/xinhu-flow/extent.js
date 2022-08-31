import request from '@/utils/request'

// 查询模块权限列表
export function listExtent(query) {
  return request({
    url: '/xinhu-flow/extent/list',
    method: 'get',
    params: query
  })
}

// 查询模块权限详细
export function getExtent(id) {
  return request({
    url: '/xinhu-flow/extent/' + id,
    method: 'get'
  })
}

// 新增模块权限
export function addExtent(data) {
  return request({
    url: '/xinhu-flow/extent',
    method: 'post',
    data: data
  })
}

// 修改模块权限
export function updateExtent(data) {
  return request({
    url: '/xinhu-flow/extent',
    method: 'put',
    data: data
  })
}

// 删除模块权限
export function delExtent(id) {
  return request({
    url: '/xinhu-flow/extent/' + id,
    method: 'delete'
  })
}
