import request from '@/utils/request'

// 查询系统登录token列表
export function listLogintoken(query) {
  return request({
    url: '/xinhu-system/logintoken/list',
    method: 'get',
    params: query
  })
}

// 查询系统登录token详细
export function getLogintoken(id) {
  return request({
    url: '/xinhu-system/logintoken/' + id,
    method: 'get'
  })
}

// 新增系统登录token
export function addLogintoken(data) {
  return request({
    url: '/xinhu-system/logintoken',
    method: 'post',
    data: data
  })
}

// 修改系统登录token
export function updateLogintoken(data) {
  return request({
    url: '/xinhu-system/logintoken',
    method: 'put',
    data: data
  })
}

// 删除系统登录token
export function delLogintoken(id) {
  return request({
    url: '/xinhu-system/logintoken/' + id,
    method: 'delete'
  })
}
