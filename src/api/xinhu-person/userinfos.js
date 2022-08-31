import request from '@/utils/request'

// 查询人员档案子列表
export function listUserinfos(query) {
  return request({
    url: '/xinhu-person/userinfos/list',
    method: 'get',
    params: query
  })
}

// 查询人员档案子详细
export function getUserinfos(id) {
  return request({
    url: '/xinhu-person/userinfos/' + id,
    method: 'get'
  })
}

// 新增人员档案子
export function addUserinfos(data) {
  return request({
    url: '/xinhu-person/userinfos',
    method: 'post',
    data: data
  })
}

// 修改人员档案子
export function updateUserinfos(data) {
  return request({
    url: '/xinhu-person/userinfos',
    method: 'put',
    data: data
  })
}

// 删除人员档案子
export function delUserinfos(id) {
  return request({
    url: '/xinhu-person/userinfos/' + id,
    method: 'delete'
  })
}
