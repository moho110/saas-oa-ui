import request from '@/utils/request'

// 查询薪资模版子列表
export function listHrsalars(query) {
  return request({
    url: '/xinhu-hr/hrsalars/list',
    method: 'get',
    params: query
  })
}

// 查询薪资模版子详细
export function getHrsalars(id) {
  return request({
    url: '/xinhu-hr/hrsalars/' + id,
    method: 'get'
  })
}

// 新增薪资模版子
export function addHrsalars(data) {
  return request({
    url: '/xinhu-hr/hrsalars',
    method: 'post',
    data: data
  })
}

// 修改薪资模版子
export function updateHrsalars(data) {
  return request({
    url: '/xinhu-hr/hrsalars',
    method: 'put',
    data: data
  })
}

// 删除薪资模版子
export function delHrsalars(id) {
  return request({
    url: '/xinhu-hr/hrsalars/' + id,
    method: 'delete'
  })
}
