import request from '@/utils/request'

// 查询微信用户信息列表
export function listWouser(query) {
  return request({
    url: '/xinhu-system/wouser/list',
    method: 'get',
    params: query
  })
}

// 查询微信用户信息详细
export function getWouser(id) {
  return request({
    url: '/xinhu-system/wouser/' + id,
    method: 'get'
  })
}

// 新增微信用户信息
export function addWouser(data) {
  return request({
    url: '/xinhu-system/wouser',
    method: 'post',
    data: data
  })
}

// 修改微信用户信息
export function updateWouser(data) {
  return request({
    url: '/xinhu-system/wouser',
    method: 'put',
    data: data
  })
}

// 删除微信用户信息
export function delWouser(id) {
  return request({
    url: '/xinhu-system/wouser/' + id,
    method: 'delete'
  })
}
