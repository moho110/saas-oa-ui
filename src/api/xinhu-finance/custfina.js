import request from '@/utils/request'

// 查询客户收付款列表
export function listCustfina(query) {
  return request({
    url: '/xinhu-finance/custfina/list',
    method: 'get',
    params: query
  })
}

// 查询客户收付款详细
export function getCustfina(id) {
  return request({
    url: '/xinhu-finance/custfina/' + id,
    method: 'get'
  })
}

// 新增客户收付款
export function addCustfina(data) {
  return request({
    url: '/xinhu-finance/custfina',
    method: 'post',
    data: data
  })
}

// 修改客户收付款
export function updateCustfina(data) {
  return request({
    url: '/xinhu-finance/custfina',
    method: 'put',
    data: data
  })
}

// 删除客户收付款
export function delCustfina(id) {
  return request({
    url: '/xinhu-finance/custfina/' + id,
    method: 'delete'
  })
}
