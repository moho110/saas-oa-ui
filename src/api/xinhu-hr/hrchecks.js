import request from '@/utils/request'

// 查询考评内容列表
export function listHrchecks(query) {
  return request({
    url: '/xinhu-hr/hrchecks/list',
    method: 'get',
    params: query
  })
}

// 查询考评内容详细
export function getHrchecks(id) {
  return request({
    url: '/xinhu-hr/hrchecks/' + id,
    method: 'get'
  })
}

// 新增考评内容
export function addHrchecks(data) {
  return request({
    url: '/xinhu-hr/hrchecks',
    method: 'post',
    data: data
  })
}

// 修改考评内容
export function updateHrchecks(data) {
  return request({
    url: '/xinhu-hr/hrchecks',
    method: 'put',
    data: data
  })
}

// 删除考评内容
export function delHrchecks(id) {
  return request({
    url: '/xinhu-hr/hrchecks/' + id,
    method: 'delete'
  })
}
