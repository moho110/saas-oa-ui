import request from '@/utils/request'

// 查询客户合同列表
export function listCustract(query) {
  return request({
    url: '/xinhu-finance/custract/list',
    method: 'get',
    params: query
  })
}

// 查询客户合同详细
export function getCustract(id) {
  return request({
    url: '/xinhu-finance/custract/' + id,
    method: 'get'
  })
}

// 新增客户合同
export function addCustract(data) {
  return request({
    url: '/xinhu-finance/custract',
    method: 'post',
    data: data
  })
}

// 修改客户合同
export function updateCustract(data) {
  return request({
    url: '/xinhu-finance/custract',
    method: 'put',
    data: data
  })
}

// 删除客户合同
export function delCustract(id) {
  return request({
    url: '/xinhu-finance/custract/' + id,
    method: 'delete'
  })
}
