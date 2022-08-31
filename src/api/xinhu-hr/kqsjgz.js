import request from '@/utils/request'

// 查询考勤时间规则列表
export function listKqsjgz(query) {
  return request({
    url: '/xinhu-hr/kqsjgz/list',
    method: 'get',
    params: query
  })
}

// 查询考勤时间规则详细
export function getKqsjgz(id) {
  return request({
    url: '/xinhu-hr/kqsjgz/' + id,
    method: 'get'
  })
}

// 新增考勤时间规则
export function addKqsjgz(data) {
  return request({
    url: '/xinhu-hr/kqsjgz',
    method: 'post',
    data: data
  })
}

// 修改考勤时间规则
export function updateKqsjgz(data) {
  return request({
    url: '/xinhu-hr/kqsjgz',
    method: 'put',
    data: data
  })
}

// 删除考勤时间规则
export function delKqsjgz(id) {
  return request({
    url: '/xinhu-hr/kqsjgz/' + id,
    method: 'delete'
  })
}
