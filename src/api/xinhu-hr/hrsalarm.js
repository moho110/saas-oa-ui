import request from '@/utils/request'

// 查询薪资模版列表
export function listHrsalarm(query) {
  return request({
    url: '/xinhu-hr/hrsalarm/list',
    method: 'get',
    params: query
  })
}

// 查询薪资模版详细
export function getHrsalarm(id) {
  return request({
    url: '/xinhu-hr/hrsalarm/' + id,
    method: 'get'
  })
}

// 新增薪资模版
export function addHrsalarm(data) {
  return request({
    url: '/xinhu-hr/hrsalarm',
    method: 'post',
    data: data
  })
}

// 修改薪资模版
export function updateHrsalarm(data) {
  return request({
    url: '/xinhu-hr/hrsalarm',
    method: 'put',
    data: data
  })
}

// 删除薪资模版
export function delHrsalarm(id) {
  return request({
    url: '/xinhu-hr/hrsalarm/' + id,
    method: 'delete'
  })
}
