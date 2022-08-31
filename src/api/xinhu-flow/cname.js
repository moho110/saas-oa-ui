import request from '@/utils/request'

// 查询自定义审核人组列表
export function listCname(query) {
  return request({
    url: '/xinhu-flow/cname/list',
    method: 'get',
    params: query
  })
}

// 查询自定义审核人组详细
export function getCname(id) {
  return request({
    url: '/xinhu-flow/cname/' + id,
    method: 'get'
  })
}

// 新增自定义审核人组
export function addCname(data) {
  return request({
    url: '/xinhu-flow/cname',
    method: 'post',
    data: data
  })
}

// 修改自定义审核人组
export function updateCname(data) {
  return request({
    url: '/xinhu-flow/cname',
    method: 'put',
    data: data
  })
}

// 删除自定义审核人组
export function delCname(id) {
  return request({
    url: '/xinhu-flow/cname/' + id,
    method: 'delete'
  })
}
