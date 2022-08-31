import request from '@/utils/request'

// 查询调薪申请列表
export function listHrtrsalary(query) {
  return request({
    url: '/xinhu-hr/hrtrsalary/list',
    method: 'get',
    params: query
  })
}

// 查询调薪申请详细
export function getHrtrsalary(id) {
  return request({
    url: '/xinhu-hr/hrtrsalary/' + id,
    method: 'get'
  })
}

// 新增调薪申请
export function addHrtrsalary(data) {
  return request({
    url: '/xinhu-hr/hrtrsalary',
    method: 'post',
    data: data
  })
}

// 修改调薪申请
export function updateHrtrsalary(data) {
  return request({
    url: '/xinhu-hr/hrtrsalary',
    method: 'put',
    data: data
  })
}

// 删除调薪申请
export function delHrtrsalary(id) {
  return request({
    url: '/xinhu-hr/hrtrsalary/' + id,
    method: 'delete'
  })
}
