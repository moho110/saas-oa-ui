import request from '@/utils/request'

// 查询任务列表
export function listWork(query) {
  return request({
    url: '/xinhu-resources/work/list',
    method: 'get',
    params: query
  })
}

// 查询任务详细
export function getWork(id) {
  return request({
    url: '/xinhu-resources/work/' + id,
    method: 'get'
  })
}

// 新增任务
export function addWork(data) {
  return request({
    url: '/xinhu-resources/work',
    method: 'post',
    data: data
  })
}

// 修改任务
export function updateWork(data) {
  return request({
    url: '/xinhu-resources/work',
    method: 'put',
    data: data
  })
}

// 删除任务
export function delWork(id) {
  return request({
    url: '/xinhu-resources/work/' + id,
    method: 'delete'
  })
}
