import request from '@/utils/request'

// 查询单据通知设置列表
export function listTodo(query) {
  return request({
    url: '/xinhu-flow/todo/list',
    method: 'get',
    params: query
  })
}

// 查询单据通知设置详细
export function getTodo(id) {
  return request({
    url: '/xinhu-flow/todo/' + id,
    method: 'get'
  })
}

// 新增单据通知设置
export function addTodo(data) {
  return request({
    url: '/xinhu-flow/todo',
    method: 'post',
    data: data
  })
}

// 修改单据通知设置
export function updateTodo(data) {
  return request({
    url: '/xinhu-flow/todo',
    method: 'put',
    data: data
  })
}

// 删除单据通知设置
export function delTodo(id) {
  return request({
    url: '/xinhu-flow/todo/' + id,
    method: 'delete'
  })
}
