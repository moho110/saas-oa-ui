import request from '@/utils/request'

// 查询车辆维修保养记录列表
export function listCarmang(query) {
  return request({
    url: '/xinhu-finance/carmang/list',
    method: 'get',
    params: query
  })
}

// 查询车辆维修保养记录详细
export function getCarmang(id) {
  return request({
    url: '/xinhu-finance/carmang/' + id,
    method: 'get'
  })
}

// 新增车辆维修保养记录
export function addCarmang(data) {
  return request({
    url: '/xinhu-finance/carmang',
    method: 'post',
    data: data
  })
}

// 修改车辆维修保养记录
export function updateCarmang(data) {
  return request({
    url: '/xinhu-finance/carmang',
    method: 'put',
    data: data
  })
}

// 删除车辆维修保养记录
export function delCarmang(id) {
  return request({
    url: '/xinhu-finance/carmang/' + id,
    method: 'delete'
  })
}
