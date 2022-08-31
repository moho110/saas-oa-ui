import request from '@/utils/request'

// 查询IM会话人员列表
export function listGroupuser(query) {
  return request({
    url: '/xinhu-hr/groupuser/list',
    method: 'get',
    params: query
  })
}

// 查询IM会话人员详细
export function getGroupuser(id) {
  return request({
    url: '/xinhu-hr/groupuser/' + id,
    method: 'get'
  })
}

// 新增IM会话人员
export function addGroupuser(data) {
  return request({
    url: '/xinhu-hr/groupuser',
    method: 'post',
    data: data
  })
}

// 修改IM会话人员
export function updateGroupuser(data) {
  return request({
    url: '/xinhu-hr/groupuser',
    method: 'put',
    data: data
  })
}

// 删除IM会话人员
export function delGroupuser(id) {
  return request({
    url: '/xinhu-hr/groupuser/' + id,
    method: 'delete'
  })
}
