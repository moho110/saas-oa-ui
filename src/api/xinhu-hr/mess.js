import request from '@/utils/request'

// 查询IM聊天记录列表
export function listMess(query) {
  return request({
    url: '/xinhu-hr/mess/list',
    method: 'get',
    params: query
  })
}

// 查询IM聊天记录详细
export function getMess(id) {
  return request({
    url: '/xinhu-hr/mess/' + id,
    method: 'get'
  })
}

// 新增IM聊天记录
export function addMess(data) {
  return request({
    url: '/xinhu-hr/mess',
    method: 'post',
    data: data
  })
}

// 修改IM聊天记录
export function updateMess(data) {
  return request({
    url: '/xinhu-hr/mess',
    method: 'put',
    data: data
  })
}

// 删除IM聊天记录
export function delMess(id) {
  return request({
    url: '/xinhu-hr/mess/' + id,
    method: 'delete'
  })
}
