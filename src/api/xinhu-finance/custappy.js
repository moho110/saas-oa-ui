import request from '@/utils/request'

// 查询客户申请使用列表
export function listCustappy(query) {
  return request({
    url: '/xinhu-finance/custappy/list',
    method: 'get',
    params: query
  })
}

// 查询客户申请使用详细
export function getCustappy(id) {
  return request({
    url: '/xinhu-finance/custappy/' + id,
    method: 'get'
  })
}

// 新增客户申请使用
export function addCustappy(data) {
  return request({
    url: '/xinhu-finance/custappy',
    method: 'post',
    data: data
  })
}

// 修改客户申请使用
export function updateCustappy(data) {
  return request({
    url: '/xinhu-finance/custappy',
    method: 'put',
    data: data
  })
}

// 删除客户申请使用
export function delCustappy(id) {
  return request({
    url: '/xinhu-finance/custappy/' + id,
    method: 'delete'
  })
}
