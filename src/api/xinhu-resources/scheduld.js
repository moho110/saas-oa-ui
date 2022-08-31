import request from '@/utils/request'

// 查询日程待办列表
export function listScheduld(query) {
  return request({
    url: '/xinhu-resources/scheduld/list',
    method: 'get',
    params: query
  })
}

// 查询日程待办详细
export function getScheduld(id) {
  return request({
    url: '/xinhu-resources/scheduld/' + id,
    method: 'get'
  })
}

// 新增日程待办
export function addScheduld(data) {
  return request({
    url: '/xinhu-resources/scheduld',
    method: 'post',
    data: data
  })
}

// 修改日程待办
export function updateScheduld(data) {
  return request({
    url: '/xinhu-resources/scheduld',
    method: 'put',
    data: data
  })
}

// 删除日程待办
export function delScheduld(id) {
  return request({
    url: '/xinhu-resources/scheduld/' + id,
    method: 'delete'
  })
}
