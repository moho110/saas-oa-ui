import request from '@/utils/request'

// 查询系统日志列表
export function listLog(query) {
  return request({
    url: '/xinhu-system/log/list',
    method: 'get',
    params: query
  })
}

// 查询系统日志详细
export function getLog(id) {
  return request({
    url: '/xinhu-system/log/' + id,
    method: 'get'
  })
}

// 新增系统日志
export function addLog(data) {
  return request({
    url: '/xinhu-system/log',
    method: 'post',
    data: data
  })
}

// 修改系统日志
export function updateLog(data) {
  return request({
    url: '/xinhu-system/log',
    method: 'put',
    data: data
  })
}

// 删除系统日志
export function delLog(id) {
  return request({
    url: '/xinhu-system/log/' + id,
    method: 'delete'
  })
}
