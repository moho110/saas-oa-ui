import request from '@/utils/request'

// 查询系统组列表
export function listGroup(query) {
  return request({
    url: '/xinhu-system/group/list',
    method: 'get',
    params: query
  })
}

// 查询系统组详细
export function getGroup(id) {
  return request({
    url: '/xinhu-system/group/' + id,
    method: 'get'
  })
}

// 新增系统组
export function addGroup(data) {
  return request({
    url: '/xinhu-system/group',
    method: 'post',
    data: data
  })
}

// 修改系统组
export function updateGroup(data) {
  return request({
    url: '/xinhu-system/group',
    method: 'put',
    data: data
  })
}

// 删除系统组
export function delGroup(id) {
  return request({
    url: '/xinhu-system/group/' + id,
    method: 'delete'
  })
}
