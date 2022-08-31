import request from '@/utils/request'

// 查询流程步骤列表
export function listCourse(query) {
  return request({
    url: '/xinhu-flow/course/list',
    method: 'get',
    params: query
  })
}

// 查询流程步骤详细
export function getCourse(id) {
  return request({
    url: '/xinhu-flow/course/' + id,
    method: 'get'
  })
}

// 新增流程步骤
export function addCourse(data) {
  return request({
    url: '/xinhu-flow/course',
    method: 'post',
    data: data
  })
}

// 修改流程步骤
export function updateCourse(data) {
  return request({
    url: '/xinhu-flow/course',
    method: 'put',
    data: data
  })
}

// 删除流程步骤
export function delCourse(id) {
  return request({
    url: '/xinhu-flow/course/' + id,
    method: 'delete'
  })
}
