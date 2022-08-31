import request from '@/utils/request'

// 查询IM会话列表
export function listGroup(query) {
  return request({
    url: '/xinhu-hr/group/list',
    method: 'get',
    params: query
  })
}

// 查询IM会话详细
export function getGroup(id) {
  return request({
    url: '/xinhu-hr/group/' + id,
    method: 'get'
  })
}

// 新增IM会话
export function addGroup(data) {
  return request({
    url: '/xinhu-hr/group',
    method: 'post',
    data: data
  })
}

// 修改IM会话
export function updateGroup(data) {
  return request({
    url: '/xinhu-hr/group',
    method: 'put',
    data: data
  })
}

// 删除IM会话
export function delGroup(id) {
  return request({
    url: '/xinhu-hr/group/' + id,
    method: 'delete'
  })
}
