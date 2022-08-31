import request from '@/utils/request'

// 查询考勤分配列表
export function listKqdist(query) {
  return request({
    url: '/xinhu-hr/kqdist/list',
    method: 'get',
    params: query
  })
}

// 查询考勤分配详细
export function getKqdist(id) {
  return request({
    url: '/xinhu-hr/kqdist/' + id,
    method: 'get'
  })
}

// 新增考勤分配
export function addKqdist(data) {
  return request({
    url: '/xinhu-hr/kqdist',
    method: 'post',
    data: data
  })
}

// 修改考勤分配
export function updateKqdist(data) {
  return request({
    url: '/xinhu-hr/kqdist',
    method: 'put',
    data: data
  })
}

// 删除考勤分配
export function delKqdist(id) {
  return request({
    url: '/xinhu-hr/kqdist/' + id,
    method: 'delete'
  })
}
