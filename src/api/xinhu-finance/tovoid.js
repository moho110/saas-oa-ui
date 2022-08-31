import request from '@/utils/request'

// 查询单据申请作废列表
export function listTovoid(query) {
  return request({
    url: '/xinhu-finance/tovoid/list',
    method: 'get',
    params: query
  })
}

// 查询单据申请作废详细
export function getTovoid(id) {
  return request({
    url: '/xinhu-finance/tovoid/' + id,
    method: 'get'
  })
}

// 新增单据申请作废
export function addTovoid(data) {
  return request({
    url: '/xinhu-finance/tovoid',
    method: 'post',
    data: data
  })
}

// 修改单据申请作废
export function updateTovoid(data) {
  return request({
    url: '/xinhu-finance/tovoid',
    method: 'put',
    data: data
  })
}

// 删除单据申请作废
export function delTovoid(id) {
  return request({
    url: '/xinhu-finance/tovoid/' + id,
    method: 'delete'
  })
}
