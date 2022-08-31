import request from '@/utils/request'

// 查询考核评分记录列表
export function listHrcheckn(query) {
  return request({
    url: '/xinhu-hr/hrcheckn/list',
    method: 'get',
    params: query
  })
}

// 查询考核评分记录详细
export function getHrcheckn(id) {
  return request({
    url: '/xinhu-hr/hrcheckn/' + id,
    method: 'get'
  })
}

// 新增考核评分记录
export function addHrcheckn(data) {
  return request({
    url: '/xinhu-hr/hrcheckn',
    method: 'post',
    data: data
  })
}

// 修改考核评分记录
export function updateHrcheckn(data) {
  return request({
    url: '/xinhu-hr/hrcheckn',
    method: 'put',
    data: data
  })
}

// 删除考核评分记录
export function delHrcheckn(id) {
  return request({
    url: '/xinhu-hr/hrcheckn/' + id,
    method: 'delete'
  })
}
