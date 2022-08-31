import request from '@/utils/request'

// 查询工资列表
export function listHrsalary(query) {
  return request({
    url: '/xinhu-hr/hrsalary/list',
    method: 'get',
    params: query
  })
}

// 查询工资详细
export function getHrsalary(id) {
  return request({
    url: '/xinhu-hr/hrsalary/' + id,
    method: 'get'
  })
}

// 新增工资
export function addHrsalary(data) {
  return request({
    url: '/xinhu-hr/hrsalary',
    method: 'post',
    data: data
  })
}

// 修改工资
export function updateHrsalary(data) {
  return request({
    url: '/xinhu-hr/hrsalary',
    method: 'put',
    data: data
  })
}

// 删除工资
export function delHrsalary(id) {
  return request({
    url: '/xinhu-hr/hrsalary/' + id,
    method: 'delete'
  })
}
