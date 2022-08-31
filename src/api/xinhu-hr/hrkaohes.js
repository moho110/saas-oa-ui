import request from '@/utils/request'

// 查询考核项目的内容列表
export function listHrkaohes(query) {
  return request({
    url: '/xinhu-hr/hrkaohes/list',
    method: 'get',
    params: query
  })
}

// 查询考核项目的内容详细
export function getHrkaohes(id) {
  return request({
    url: '/xinhu-hr/hrkaohes/' + id,
    method: 'get'
  })
}

// 新增考核项目的内容
export function addHrkaohes(data) {
  return request({
    url: '/xinhu-hr/hrkaohes',
    method: 'post',
    data: data
  })
}

// 修改考核项目的内容
export function updateHrkaohes(data) {
  return request({
    url: '/xinhu-hr/hrkaohes',
    method: 'put',
    data: data
  })
}

// 删除考核项目的内容
export function delHrkaohes(id) {
  return request({
    url: '/xinhu-hr/hrkaohes/' + id,
    method: 'delete'
  })
}
