import request from '@/utils/request'

// 查询单据通知给对应人员列表
export function listTodos(query) {
  return request({
    url: '/xinhu-flow/todos/list',
    method: 'get',
    params: query
  })
}

// 查询单据通知给对应人员详细
export function getTodos(id) {
  return request({
    url: '/xinhu-flow/todos/' + id,
    method: 'get'
  })
}

// 新增单据通知给对应人员
export function addTodos(data) {
  return request({
    url: '/xinhu-flow/todos',
    method: 'post',
    data: data
  })
}

// 修改单据通知给对应人员
export function updateTodos(data) {
  return request({
    url: '/xinhu-flow/todos',
    method: 'put',
    data: data
  })
}

// 删除单据通知给对应人员
export function delTodos(id) {
  return request({
    url: '/xinhu-flow/todos/' + id,
    method: 'delete'
  })
}
