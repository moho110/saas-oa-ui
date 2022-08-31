import request from '@/utils/request'

// 查询印章列表
export function listSeal(query) {
  return request({
    url: '/xinhu-document/seal/list',
    method: 'get',
    params: query
  })
}

// 查询印章详细
export function getSeal(id) {
  return request({
    url: '/xinhu-document/seal/' + id,
    method: 'get'
  })
}

// 新增印章
export function addSeal(data) {
  return request({
    url: '/xinhu-document/seal',
    method: 'post',
    data: data
  })
}

// 修改印章
export function updateSeal(data) {
  return request({
    url: '/xinhu-document/seal',
    method: 'put',
    data: data
  })
}

// 删除印章
export function delSeal(id) {
  return request({
    url: '/xinhu-document/seal/' + id,
    method: 'delete'
  })
}
