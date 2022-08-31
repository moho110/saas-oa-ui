import request from '@/utils/request'

// 查询模块元素列表
export function listElement(query) {
  return request({
    url: '/xinhu-flow/element/list',
    method: 'get',
    params: query
  })
}

// 查询模块元素详细
export function getElement(id) {
  return request({
    url: '/xinhu-flow/element/' + id,
    method: 'get'
  })
}

// 新增模块元素
export function addElement(data) {
  return request({
    url: '/xinhu-flow/element',
    method: 'post',
    data: data
  })
}

// 修改模块元素
export function updateElement(data) {
  return request({
    url: '/xinhu-flow/element',
    method: 'put',
    data: data
  })
}

// 删除模块元素
export function delElement(id) {
  return request({
    url: '/xinhu-flow/element/' + id,
    method: 'delete'
  })
}
