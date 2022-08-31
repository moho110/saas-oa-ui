import request from '@/utils/request'

// 查询REIM即时通讯平台用户列表
export function listUser(query) {
  return request({
    url: '/xinhu-system/user/list',
    method: 'get',
    params: query
  })
}

// 查询REIM即时通讯平台用户详细
export function getUser(id) {
  return request({
    url: '/xinhu-system/user/' + id,
    method: 'get'
  })
}

// 新增REIM即时通讯平台用户
export function addUser(data) {
  return request({
    url: '/xinhu-system/user',
    method: 'post',
    data: data
  })
}

// 修改REIM即时通讯平台用户
export function updateUser(data) {
  return request({
    url: '/xinhu-system/user',
    method: 'put',
    data: data
  })
}

// 删除REIM即时通讯平台用户
export function delUser(id) {
  return request({
    url: '/xinhu-system/user/' + id,
    method: 'delete'
  })
}
