import request from '@/utils/request'

// 查询车辆预定列表
export function listCarmrese(query) {
  return request({
    url: '/xinhu-finance/carmrese/list',
    method: 'get',
    params: query
  })
}

// 查询车辆预定详细
export function getCarmrese(id) {
  return request({
    url: '/xinhu-finance/carmrese/' + id,
    method: 'get'
  })
}

// 新增车辆预定
export function addCarmrese(data) {
  return request({
    url: '/xinhu-finance/carmrese',
    method: 'post',
    data: data
  })
}

// 修改车辆预定
export function updateCarmrese(data) {
  return request({
    url: '/xinhu-finance/carmrese',
    method: 'put',
    data: data
  })
}

// 删除车辆预定
export function delCarmrese(id) {
  return request({
    url: '/xinhu-finance/carmrese/' + id,
    method: 'delete'
  })
}
