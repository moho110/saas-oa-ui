import request from '@/utils/request'

// 查询用户合同列表
export function listUserract(query) {
  return request({
    url: '/xinhu-person/userract/list',
    method: 'get',
    params: query
  })
}

// 查询用户合同详细
export function getUserract(id) {
  return request({
    url: '/xinhu-person/userract/' + id,
    method: 'get'
  })
}

// 新增用户合同
export function addUserract(data) {
  return request({
    url: '/xinhu-person/userract',
    method: 'post',
    data: data
  })
}

// 修改用户合同
export function updateUserract(data) {
  return request({
    url: '/xinhu-person/userract',
    method: 'put',
    data: data
  })
}

// 删除用户合同
export function delUserract(id) {
  return request({
    url: '/xinhu-person/userract/' + id,
    method: 'delete'
  })
}
