import request from '@/utils/request'

// 查询休息时间规则列表
export function listKqxxsj(query) {
  return request({
    url: '/xinhu-hr/kqxxsj/list',
    method: 'get',
    params: query
  })
}

// 查询休息时间规则详细
export function getKqxxsj(id) {
  return request({
    url: '/xinhu-hr/kqxxsj/' + id,
    method: 'get'
  })
}

// 新增休息时间规则
export function addKqxxsj(data) {
  return request({
    url: '/xinhu-hr/kqxxsj',
    method: 'post',
    data: data
  })
}

// 修改休息时间规则
export function updateKqxxsj(data) {
  return request({
    url: '/xinhu-hr/kqxxsj',
    method: 'put',
    data: data
  })
}

// 删除休息时间规则
export function delKqxxsj(id) {
  return request({
    url: '/xinhu-hr/kqxxsj/' + id,
    method: 'delete'
  })
}
