import request from '@/utils/request'

// 查询日报分析统计列表
export function listDailyfx(query) {
  return request({
    url: '/xinhu-finance/dailyfx/list',
    method: 'get',
    params: query
  })
}

// 查询日报分析统计详细
export function getDailyfx(id) {
  return request({
    url: '/xinhu-finance/dailyfx/' + id,
    method: 'get'
  })
}

// 新增日报分析统计
export function addDailyfx(data) {
  return request({
    url: '/xinhu-finance/dailyfx',
    method: 'post',
    data: data
  })
}

// 修改日报分析统计
export function updateDailyfx(data) {
  return request({
    url: '/xinhu-finance/dailyfx',
    method: 'put',
    data: data
  })
}

// 删除日报分析统计
export function delDailyfx(id) {
  return request({
    url: '/xinhu-finance/dailyfx/' + id,
    method: 'delete'
  })
}
