import request from '@/utils/request'

// 查询模块多模版设置列表
export function listModetpl(query) {
  return request({
    url: '/xinhu-flow/modetpl/list',
    method: 'get',
    params: query
  })
}

// 查询模块多模版设置详细
export function getModetpl(id) {
  return request({
    url: '/xinhu-flow/modetpl/' + id,
    method: 'get'
  })
}

// 新增模块多模版设置
export function addModetpl(data) {
  return request({
    url: '/xinhu-flow/modetpl',
    method: 'post',
    data: data
  })
}

// 修改模块多模版设置
export function updateModetpl(data) {
  return request({
    url: '/xinhu-flow/modetpl',
    method: 'put',
    data: data
  })
}

// 删除模块多模版设置
export function delModetpl(id) {
  return request({
    url: '/xinhu-flow/modetpl/' + id,
    method: 'delete'
  })
}
