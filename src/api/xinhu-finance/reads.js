import request from '@/utils/request'

// 查询单据浏览记录列表
export function listReads(query) {
  return request({
    url: '/xinhu-finance/reads/list',
    method: 'get',
    params: query
  })
}

// 查询单据浏览记录详细
export function getReads(id) {
  return request({
    url: '/xinhu-finance/reads/' + id,
    method: 'get'
  })
}

// 新增单据浏览记录
export function addReads(data) {
  return request({
    url: '/xinhu-finance/reads',
    method: 'post',
    data: data
  })
}

// 修改单据浏览记录
export function updateReads(data) {
  return request({
    url: '/xinhu-finance/reads',
    method: 'put',
    data: data
  })
}

// 删除单据浏览记录
export function delReads(id) {
  return request({
    url: '/xinhu-finance/reads/' + id,
    method: 'delete'
  })
}
