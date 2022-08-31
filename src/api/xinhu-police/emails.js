import request from '@/utils/request'

// 查询邮件子列表
export function listEmails(query) {
  return request({
    url: '/xinhu-police/emails/list',
    method: 'get',
    params: query
  })
}

// 查询邮件子详细
export function getEmails(id) {
  return request({
    url: '/xinhu-police/emails/' + id,
    method: 'get'
  })
}

// 新增邮件子
export function addEmails(data) {
  return request({
    url: '/xinhu-police/emails',
    method: 'post',
    data: data
  })
}

// 修改邮件子
export function updateEmails(data) {
  return request({
    url: '/xinhu-police/emails',
    method: 'put',
    data: data
  })
}

// 删除邮件子
export function delEmails(id) {
  return request({
    url: '/xinhu-police/emails/' + id,
    method: 'delete'
  })
}
