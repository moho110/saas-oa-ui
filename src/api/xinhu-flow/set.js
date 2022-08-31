import request from '@/utils/request'

// 查询流程模块列表
export function listSet(query) {
  return request({
    url: '/xinhu-flow/set/list',
    method: 'get',
    params: query
  })
}

// 查询流程模块详细
export function getSet(id) {
  return request({
    url: '/xinhu-flow/set/' + id,
    method: 'get'
  })
}

// 新增流程模块
export function addSet(data) {
  return request({
    url: '/xinhu-flow/set',
    method: 'post',
    data: data
  })
}

// 修改流程模块
export function updateSet(data) {
  return request({
    url: '/xinhu-flow/set',
    method: 'put',
    data: data
  })
}

// 删除流程模块
export function delSet(id) {
  return request({
    url: '/xinhu-flow/set/' + id,
    method: 'delete'
  })
}
