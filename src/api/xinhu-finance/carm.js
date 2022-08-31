import request from '@/utils/request'

// 查询车辆列表
export function listCarm(query) {
  return request({
    url: '/xinhu-finance/carm/list',
    method: 'get',
    params: query
  })
}

// 查询车辆详细
export function getCarm(id) {
  return request({
    url: '/xinhu-finance/carm/' + id,
    method: 'get'
  })
}

// 新增车辆
export function addCarm(data) {
  return request({
    url: '/xinhu-finance/carm',
    method: 'post',
    data: data
  })
}

// 修改车辆
export function updateCarm(data) {
  return request({
    url: '/xinhu-finance/carm',
    method: 'put',
    data: data
  })
}

// 删除车辆
export function delCarm(id) {
  return request({
    url: '/xinhu-finance/carm/' + id,
    method: 'delete'
  })
}
