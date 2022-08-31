import request from '@/utils/request'

// 查询考勤分析列表
export function listKqanay(query) {
  return request({
    url: '/xinhu-hr/kqanay/list',
    method: 'get',
    params: query
  })
}

// 查询考勤分析详细
export function getKqanay(id) {
  return request({
    url: '/xinhu-hr/kqanay/' + id,
    method: 'get'
  })
}

// 新增考勤分析
export function addKqanay(data) {
  return request({
    url: '/xinhu-hr/kqanay',
    method: 'post',
    data: data
  })
}

// 修改考勤分析
export function updateKqanay(data) {
  return request({
    url: '/xinhu-hr/kqanay',
    method: 'put',
    data: data
  })
}

// 删除考勤分析
export function delKqanay(id) {
  return request({
    url: '/xinhu-hr/kqanay/' + id,
    method: 'delete'
  })
}
