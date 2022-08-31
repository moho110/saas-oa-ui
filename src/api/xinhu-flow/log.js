import request from '@/utils/request'

// 查询单据操作记录列表
export function listLog(query) {
  return request({
    url: '/xinhu-flow/log/list',
    method: 'get',
    params: query
  })
}

// 查询单据操作记录详细
export function getLog(id) {
  return request({
    url: '/xinhu-flow/log/' + id,
    method: 'get'
  })
}

// 新增单据操作记录
export function addLog(data) {
  return request({
    url: '/xinhu-flow/log',
    method: 'post',
    data: data
  })
}

// 修改单据操作记录
export function updateLog(data) {
  return request({
    url: '/xinhu-flow/log',
    method: 'put',
    data: data
  })
}

// 删除单据操作记录
export function delLog(id) {
  return request({
    url: '/xinhu-flow/log/' + id,
    method: 'delete'
  })
}
