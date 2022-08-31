import request from '@/utils/request'

// 查询邮件主列表
export function listEmailm(query) {
  return request({
    url: '/xinhu-police/emailm/list',
    method: 'get',
    params: query
  })
}

// 查询邮件主详细
export function getEmailm(id) {
  return request({
    url: '/xinhu-police/emailm/' + id,
    method: 'get'
  })
}

// 新增邮件主
export function addEmailm(data) {
  return request({
    url: '/xinhu-police/emailm',
    method: 'post',
    data: data
  })
}

// 修改邮件主
export function updateEmailm(data) {
  return request({
    url: '/xinhu-police/emailm',
    method: 'put',
    data: data
  })
}

// 删除邮件主
export function delEmailm(id) {
  return request({
    url: '/xinhu-police/emailm/' + id,
    method: 'delete'
  })
}
