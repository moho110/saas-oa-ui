import request from '@/utils/request'

// 查询IM会话记录历史列表
export function listHistory(query) {
  return request({
    url: '/xinhu-hr/history/list',
    method: 'get',
    params: query
  })
}

// 查询IM会话记录历史详细
export function getHistory(id) {
  return request({
    url: '/xinhu-hr/history/' + id,
    method: 'get'
  })
}

// 新增IM会话记录历史
export function addHistory(data) {
  return request({
    url: '/xinhu-hr/history',
    method: 'post',
    data: data
  })
}

// 修改IM会话记录历史
export function updateHistory(data) {
  return request({
    url: '/xinhu-hr/history',
    method: 'put',
    data: data
  })
}

// 删除IM会话记录历史
export function delHistory(id) {
  return request({
    url: '/xinhu-hr/history/' + id,
    method: 'delete'
  })
}
