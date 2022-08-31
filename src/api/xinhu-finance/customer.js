import request from '@/utils/request'

// 查询客户列表
export function listCustomer(query) {
  return request({
    url: '/xinhu-finance/customer/list',
    method: 'get',
    params: query
  })
}

// 查询客户详细
export function getCustomer(id) {
  return request({
    url: '/xinhu-finance/customer/' + id,
    method: 'get'
  })
}

// 新增客户
export function addCustomer(data) {
  return request({
    url: '/xinhu-finance/customer',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateCustomer(data) {
  return request({
    url: '/xinhu-finance/customer',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delCustomer(id) {
  return request({
    url: '/xinhu-finance/customer/' + id,
    method: 'delete'
  })
}
