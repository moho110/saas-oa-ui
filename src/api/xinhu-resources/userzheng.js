import request from '@/utils/request'

// 查询说明列表
export function listUserzheng(query) {
  return request({
    url: '/xinhu-resources/userzheng/list',
    method: 'get',
    params: query
  })
}

// 查询说明详细
export function getUserzheng(id) {
  return request({
    url: '/xinhu-resources/userzheng/' + id,
    method: 'get'
  })
}

// 新增说明
export function addUserzheng(data) {
  return request({
    url: '/xinhu-resources/userzheng',
    method: 'post',
    data: data
  })
}

// 修改说明
export function updateUserzheng(data) {
  return request({
    url: '/xinhu-resources/userzheng',
    method: 'put',
    data: data
  })
}

// 删除说明
export function delUserzheng(id) {
  return request({
    url: '/xinhu-resources/userzheng/' + id,
    method: 'delete'
  })
}
