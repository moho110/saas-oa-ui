import request from '@/utils/request'

// 查询用户档案列表
export function listUserinfo(query) {
  return request({
    url: '/xinhu-person/userinfo/list',
    method: 'get',
    params: query
  })
}

// 查询用户档案详细
export function getUserinfo(id) {
  return request({
    url: '/xinhu-person/userinfo/' + id,
    method: 'get'
  })
}

// 新增用户档案
export function addUserinfo(data) {
  return request({
    url: '/xinhu-person/userinfo',
    method: 'post',
    data: data
  })
}

// 修改用户档案
export function updateUserinfo(data) {
  return request({
    url: '/xinhu-person/userinfo',
    method: 'put',
    data: data
  })
}

// 删除用户档案
export function delUserinfo(id) {
  return request({
    url: '/xinhu-person/userinfo/' + id,
    method: 'delete'
  })
}
