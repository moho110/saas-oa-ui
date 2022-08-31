import request from '@/utils/request'

// 查询工程通知列表
export function listGctodo(query) {
  return request({
    url: '/xinhu-police/gctodo/list',
    method: 'get',
    params: query
  })
}

// 查询工程通知详细
export function getGctodo(id) {
  return request({
    url: '/xinhu-police/gctodo/' + id,
    method: 'get'
  })
}

// 新增工程通知
export function addGctodo(data) {
  return request({
    url: '/xinhu-police/gctodo',
    method: 'post',
    data: data
  })
}

// 修改工程通知
export function updateGctodo(data) {
  return request({
    url: '/xinhu-police/gctodo',
    method: 'put',
    data: data
  })
}

// 删除工程通知
export function delGctodo(id) {
  return request({
    url: '/xinhu-police/gctodo/' + id,
    method: 'delete'
  })
}
