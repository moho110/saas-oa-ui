import request from '@/utils/request'

// 查询考勤定位规则列表
export function listKqdw(query) {
  return request({
    url: '/xinhu-hr/kqdw/list',
    method: 'get',
    params: query
  })
}

// 查询考勤定位规则详细
export function getKqdw(id) {
  return request({
    url: '/xinhu-hr/kqdw/' + id,
    method: 'get'
  })
}

// 新增考勤定位规则
export function addKqdw(data) {
  return request({
    url: '/xinhu-hr/kqdw',
    method: 'post',
    data: data
  })
}

// 修改考勤定位规则
export function updateKqdw(data) {
  return request({
    url: '/xinhu-hr/kqdw',
    method: 'put',
    data: data
  })
}

// 删除考勤定位规则
export function delKqdw(id) {
  return request({
    url: '/xinhu-hr/kqdw/' + id,
    method: 'delete'
  })
}
