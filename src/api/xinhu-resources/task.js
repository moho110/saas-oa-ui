import request from '@/utils/request'

// 查询计划任务列表
export function listTask(query) {
  return request({
    url: '/xinhu-resources/task/list',
    method: 'get',
    params: query
  })
}

// 查询计划任务详细
export function getTask(id) {
  return request({
    url: '/xinhu-resources/task/' + id,
    method: 'get'
  })
}

// 新增计划任务
export function addTask(data) {
  return request({
    url: '/xinhu-resources/task',
    method: 'post',
    data: data
  })
}

// 修改计划任务
export function updateTask(data) {
  return request({
    url: '/xinhu-resources/task',
    method: 'put',
    data: data
  })
}

// 删除计划任务
export function delTask(id) {
  return request({
    url: '/xinhu-resources/task/' + id,
    method: 'delete'
  })
}
