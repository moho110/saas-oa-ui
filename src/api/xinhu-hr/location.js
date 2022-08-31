import request from '@/utils/request'

// 查询外勤定位列表
export function listLocation(query) {
  return request({
    url: '/xinhu-hr/location/list',
    method: 'get',
    params: query
  })
}

// 查询外勤定位详细
export function getLocation(id) {
  return request({
    url: '/xinhu-hr/location/' + id,
    method: 'get'
  })
}

// 新增外勤定位
export function addLocation(data) {
  return request({
    url: '/xinhu-hr/location',
    method: 'post',
    data: data
  })
}

// 修改外勤定位
export function updateLocation(data) {
  return request({
    url: '/xinhu-hr/location',
    method: 'put',
    data: data
  })
}

// 删除外勤定位
export function delLocation(id) {
  return request({
    url: '/xinhu-hr/location/' + id,
    method: 'delete'
  })
}
