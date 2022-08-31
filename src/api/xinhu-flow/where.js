import request from '@/utils/request'

// 查询单据条件列表
export function listWhere(query) {
  return request({
    url: '/xinhu-flow/where/list',
    method: 'get',
    params: query
  })
}

// 查询单据条件详细
export function getWhere(id) {
  return request({
    url: '/xinhu-flow/where/' + id,
    method: 'get'
  })
}

// 新增单据条件
export function addWhere(data) {
  return request({
    url: '/xinhu-flow/where',
    method: 'post',
    data: data
  })
}

// 修改单据条件
export function updateWhere(data) {
  return request({
    url: '/xinhu-flow/where',
    method: 'put',
    data: data
  })
}

// 删除单据条件
export function delWhere(id) {
  return request({
    url: '/xinhu-flow/where/' + id,
    method: 'delete'
  })
}
