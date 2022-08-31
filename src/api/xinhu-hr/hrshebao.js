import request from '@/utils/request'

// 查询社保公积金列表
export function listHrshebao(query) {
  return request({
    url: '/xinhu-hr/hrshebao/list',
    method: 'get',
    params: query
  })
}

// 查询社保公积金详细
export function getHrshebao(id) {
  return request({
    url: '/xinhu-hr/hrshebao/' + id,
    method: 'get'
  })
}

// 新增社保公积金
export function addHrshebao(data) {
  return request({
    url: '/xinhu-hr/hrshebao',
    method: 'post',
    data: data
  })
}

// 修改社保公积金
export function updateHrshebao(data) {
  return request({
    url: '/xinhu-hr/hrshebao',
    method: 'put',
    data: data
  })
}

// 删除社保公积金
export function delHrshebao(id) {
  return request({
    url: '/xinhu-hr/hrshebao/' + id,
    method: 'delete'
  })
}
