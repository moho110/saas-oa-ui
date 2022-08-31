import request from '@/utils/request'

// 查询单据的审核人列表
export function listChecks(query) {
  return request({
    url: '/xinhu-flow/checks/list',
    method: 'get',
    params: query
  })
}

// 查询单据的审核人详细
export function getChecks(id) {
  return request({
    url: '/xinhu-flow/checks/' + id,
    method: 'get'
  })
}

// 新增单据的审核人
export function addChecks(data) {
  return request({
    url: '/xinhu-flow/checks',
    method: 'post',
    data: data
  })
}

// 修改单据的审核人
export function updateChecks(data) {
  return request({
    url: '/xinhu-flow/checks',
    method: 'put',
    data: data
  })
}

// 删除单据的审核人
export function delChecks(id) {
  return request({
    url: '/xinhu-flow/checks/' + id,
    method: 'delete'
  })
}
