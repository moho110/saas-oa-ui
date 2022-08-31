import request from '@/utils/request'

// 查询回执确认列表
export function listReceipt(query) {
  return request({
    url: '/xinhu-finance/receipt/list',
    method: 'get',
    params: query
  })
}

// 查询回执确认详细
export function getReceipt(id) {
  return request({
    url: '/xinhu-finance/receipt/' + id,
    method: 'get'
  })
}

// 新增回执确认
export function addReceipt(data) {
  return request({
    url: '/xinhu-finance/receipt',
    method: 'post',
    data: data
  })
}

// 修改回执确认
export function updateReceipt(data) {
  return request({
    url: '/xinhu-finance/receipt',
    method: 'put',
    data: data
  })
}

// 删除回执确认
export function delReceipt(id) {
  return request({
    url: '/xinhu-finance/receipt/' + id,
    method: 'delete'
  })
}
