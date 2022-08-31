import request from '@/utils/request'

// 查询修改记录列表
export function listEditrecord(query) {
  return request({
    url: '/xinhu-police/editrecord/list',
    method: 'get',
    params: query
  })
}

// 查询修改记录详细
export function getEditrecord(id) {
  return request({
    url: '/xinhu-police/editrecord/' + id,
    method: 'get'
  })
}

// 新增修改记录
export function addEditrecord(data) {
  return request({
    url: '/xinhu-police/editrecord',
    method: 'post',
    data: data
  })
}

// 修改修改记录
export function updateEditrecord(data) {
  return request({
    url: '/xinhu-police/editrecord',
    method: 'put',
    data: data
  })
}

// 删除修改记录
export function delEditrecord(id) {
  return request({
    url: '/xinhu-police/editrecord/' + id,
    method: 'delete'
  })
}
