import request from '@/utils/request'

// 查询印章申请使用列表
export function listSealapl(query) {
  return request({
    url: '/xinhu-document/sealapl/list',
    method: 'get',
    params: query
  })
}

// 查询印章申请使用详细
export function getSealapl(id) {
  return request({
    url: '/xinhu-document/sealapl/' + id,
    method: 'get'
  })
}

// 新增印章申请使用
export function addSealapl(data) {
  return request({
    url: '/xinhu-document/sealapl',
    method: 'post',
    data: data
  })
}

// 修改印章申请使用
export function updateSealapl(data) {
  return request({
    url: '/xinhu-document/sealapl',
    method: 'put',
    data: data
  })
}

// 删除印章申请使用
export function delSealapl(id) {
  return request({
    url: '/xinhu-document/sealapl/' + id,
    method: 'delete'
  })
}
