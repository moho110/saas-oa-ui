import request from '@/utils/request'

// 查询提醒消息列表
export function listTodo(query) {
  return request({
    url: '/xinhu-resources/todo/list',
    method: 'get',
    params: query
  })
}

// 查询提醒消息详细
export function getTodo(id) {
  return request({
    url: '/xinhu-resources/todo/' + id,
    method: 'get'
  })
}

// 新增提醒消息
export function addTodo(data) {
  return request({
    url: '/xinhu-resources/todo',
    method: 'post',
    data: data
  })
}

// 修改提醒消息
export function updateTodo(data) {
  return request({
    url: '/xinhu-resources/todo',
    method: 'put',
    data: data
  })
}

// 删除提醒消息
export function delTodo(id) {
  return request({
    url: '/xinhu-resources/todo/' + id,
    method: 'delete'
  })
}
