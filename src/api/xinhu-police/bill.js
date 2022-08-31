import request from '@/utils/request'

// 查询流程单据列表
export function listBill(query) {
  return request({
    url: '/xinhu-police/bill/list',
    method: 'get',
    params: query
  })
}

// 查询流程单据详细
export function getBill(id) {
  return request({
    url: '/xinhu-police/bill/' + id,
    method: 'get'
  })
}

// 新增流程单据
export function addBill(data) {
  return request({
    url: '/xinhu-police/bill',
    method: 'post',
    data: data
  })
}

// 修改流程单据
export function updateBill(data) {
  return request({
    url: '/xinhu-police/bill',
    method: 'put',
    data: data
  })
}

// 删除流程单据
export function delBill(id) {
  return request({
    url: '/xinhu-police/bill/' + id,
    method: 'delete'
  })
}
