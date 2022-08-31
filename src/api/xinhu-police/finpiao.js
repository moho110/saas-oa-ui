import request from '@/utils/request'

// 查询发票管理列表
export function listFinpiao(query) {
  return request({
    url: '/xinhu-police/finpiao/list',
    method: 'get',
    params: query
  })
}

// 查询发票管理详细
export function getFinpiao(id) {
  return request({
    url: '/xinhu-police/finpiao/' + id,
    method: 'get'
  })
}

// 新增发票管理
export function addFinpiao(data) {
  return request({
    url: '/xinhu-police/finpiao',
    method: 'post',
    data: data
  })
}

// 修改发票管理
export function updateFinpiao(data) {
  return request({
    url: '/xinhu-police/finpiao',
    method: 'put',
    data: data
  })
}

// 删除发票管理
export function delFinpiao(id) {
  return request({
    url: '/xinhu-police/finpiao/' + id,
    method: 'delete'
  })
}
