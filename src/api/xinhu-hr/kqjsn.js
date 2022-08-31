import request from '@/utils/request'

// 查询考勤机设备列表
export function listKqjsn(query) {
  return request({
    url: '/xinhu-hr/kqjsn/list',
    method: 'get',
    params: query
  })
}

// 查询考勤机设备详细
export function getKqjsn(id) {
  return request({
    url: '/xinhu-hr/kqjsn/' + id,
    method: 'get'
  })
}

// 新增考勤机设备
export function addKqjsn(data) {
  return request({
    url: '/xinhu-hr/kqjsn',
    method: 'post',
    data: data
  })
}

// 修改考勤机设备
export function updateKqjsn(data) {
  return request({
    url: '/xinhu-hr/kqjsn',
    method: 'put',
    data: data
  })
}

// 删除考勤机设备
export function delKqjsn(id) {
  return request({
    url: '/xinhu-hr/kqjsn/' + id,
    method: 'delete'
  })
}
