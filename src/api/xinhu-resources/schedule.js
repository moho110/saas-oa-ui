import request from '@/utils/request'

// 查询日程列表
export function listSchedule(query) {
  return request({
    url: '/xinhu-resources/schedule/list',
    method: 'get',
    params: query
  })
}

// 查询日程详细
export function getSchedule(id) {
  return request({
    url: '/xinhu-resources/schedule/' + id,
    method: 'get'
  })
}

// 新增日程
export function addSchedule(data) {
  return request({
    url: '/xinhu-resources/schedule',
    method: 'post',
    data: data
  })
}

// 修改日程
export function updateSchedule(data) {
  return request({
    url: '/xinhu-resources/schedule',
    method: 'put',
    data: data
  })
}

// 删除日程
export function delSchedule(id) {
  return request({
    url: '/xinhu-resources/schedule/' + id,
    method: 'delete'
  })
}
