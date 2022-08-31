import request from '@/utils/request'

// 查询IM聊天消息状态列表
export function listMesszt(query) {
  return request({
    url: '/xinhu-hr/messzt/list',
    method: 'get',
    params: query
  })
}

// 查询IM聊天消息状态详细
export function getMesszt(id) {
  return request({
    url: '/xinhu-hr/messzt/' + id,
    method: 'get'
  })
}

// 新增IM聊天消息状态
export function addMesszt(data) {
  return request({
    url: '/xinhu-hr/messzt',
    method: 'post',
    data: data
  })
}

// 修改IM聊天消息状态
export function updateMesszt(data) {
  return request({
    url: '/xinhu-hr/messzt',
    method: 'put',
    data: data
  })
}

// 删除IM聊天消息状态
export function delMesszt(id) {
  return request({
    url: '/xinhu-hr/messzt/' + id,
    method: 'delete'
  })
}
