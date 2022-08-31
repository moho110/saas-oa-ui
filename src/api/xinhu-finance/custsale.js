import request from '@/utils/request'

// 查询销售机会列表
export function listCustsale(query) {
  return request({
    url: '/xinhu-finance/custsale/list',
    method: 'get',
    params: query
  })
}

// 查询销售机会详细
export function getCustsale(id) {
  return request({
    url: '/xinhu-finance/custsale/' + id,
    method: 'get'
  })
}

// 新增销售机会
export function addCustsale(data) {
  return request({
    url: '/xinhu-finance/custsale',
    method: 'post',
    data: data
  })
}

// 修改销售机会
export function updateCustsale(data) {
  return request({
    url: '/xinhu-finance/custsale',
    method: 'put',
    data: data
  })
}

// 删除销售机会
export function delCustsale(id) {
  return request({
    url: '/xinhu-finance/custsale/' + id,
    method: 'delete'
  })
}
