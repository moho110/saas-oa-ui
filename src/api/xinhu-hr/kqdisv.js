import request from '@/utils/request'

// 查询考勤排班列表
export function listKqdisv(query) {
  return request({
    url: '/xinhu-hr/kqdisv/list',
    method: 'get',
    params: query
  })
}

// 查询考勤排班详细
export function getKqdisv(id) {
  return request({
    url: '/xinhu-hr/kqdisv/' + id,
    method: 'get'
  })
}

// 新增考勤排班
export function addKqdisv(data) {
  return request({
    url: '/xinhu-hr/kqdisv',
    method: 'post',
    data: data
  })
}

// 修改考勤排班
export function updateKqdisv(data) {
  return request({
    url: '/xinhu-hr/kqdisv',
    method: 'put',
    data: data
  })
}

// 删除考勤排班
export function delKqdisv(id) {
  return request({
    url: '/xinhu-hr/kqdisv/' + id,
    method: 'delete'
  })
}
