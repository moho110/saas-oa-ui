import request from '@/utils/request'

// 查询车辆信息登记列表
export function listCarms(query) {
  return request({
    url: '/xinhu-finance/carms/list',
    method: 'get',
    params: query
  })
}

// 查询车辆信息登记详细
export function getCarms(id) {
  return request({
    url: '/xinhu-finance/carms/' + id,
    method: 'get'
  })
}

// 新增车辆信息登记
export function addCarms(data) {
  return request({
    url: '/xinhu-finance/carms',
    method: 'post',
    data: data
  })
}

// 修改车辆信息登记
export function updateCarms(data) {
  return request({
    url: '/xinhu-finance/carms',
    method: 'put',
    data: data
  })
}

// 删除车辆信息登记
export function delCarms(id) {
  return request({
    url: '/xinhu-finance/carms/' + id,
    method: 'delete'
  })
}
