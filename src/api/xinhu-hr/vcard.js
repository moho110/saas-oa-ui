import request from '@/utils/request'

// 查询个人通讯录列表
export function listVcard(query) {
  return request({
    url: '/xinhu-hr/vcard/list',
    method: 'get',
    params: query
  })
}

// 查询个人通讯录详细
export function getVcard(id) {
  return request({
    url: '/xinhu-hr/vcard/' + id,
    method: 'get'
  })
}

// 新增个人通讯录
export function addVcard(data) {
  return request({
    url: '/xinhu-hr/vcard',
    method: 'post',
    data: data
  })
}

// 修改个人通讯录
export function updateVcard(data) {
  return request({
    url: '/xinhu-hr/vcard',
    method: 'put',
    data: data
  })
}

// 删除个人通讯录
export function delVcard(id) {
  return request({
    url: '/xinhu-hr/vcard/' + id,
    method: 'delete'
  })
}
