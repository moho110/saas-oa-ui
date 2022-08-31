import request from '@/utils/request'

// 查询跟进计划列表
export function listCustplan(query) {
  return request({
    url: '/xinhu-finance/custplan/list',
    method: 'get',
    params: query
  })
}

// 查询跟进计划详细
export function getCustplan(id) {
  return request({
    url: '/xinhu-finance/custplan/' + id,
    method: 'get'
  })
}

// 新增跟进计划
export function addCustplan(data) {
  return request({
    url: '/xinhu-finance/custplan',
    method: 'post',
    data: data
  })
}

// 修改跟进计划
export function updateCustplan(data) {
  return request({
    url: '/xinhu-finance/custplan',
    method: 'put',
    data: data
  })
}

// 删除跟进计划
export function delCustplan(id) {
  return request({
    url: '/xinhu-finance/custplan/' + id,
    method: 'delete'
  })
}
