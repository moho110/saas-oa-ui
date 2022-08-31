import request from '@/utils/request'

// 查询考核评分列表
export function listHrcheck(query) {
  return request({
    url: '/xinhu-hr/hrcheck/list',
    method: 'get',
    params: query
  })
}

// 查询考核评分详细
export function getHrcheck(id) {
  return request({
    url: '/xinhu-hr/hrcheck/' + id,
    method: 'get'
  })
}

// 新增考核评分
export function addHrcheck(data) {
  return request({
    url: '/xinhu-hr/hrcheck',
    method: 'post',
    data: data
  })
}

// 修改考核评分
export function updateHrcheck(data) {
  return request({
    url: '/xinhu-hr/hrcheck',
    method: 'put',
    data: data
  })
}

// 删除考核评分
export function delHrcheck(id) {
  return request({
    url: '/xinhu-hr/hrcheck/' + id,
    method: 'delete'
  })
}
