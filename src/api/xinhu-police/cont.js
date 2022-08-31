import request from '@/utils/request'

// 查询系统发送邮件内容列表
export function listCont(query) {
  return request({
    url: '/xinhu-police/cont/list',
    method: 'get',
    params: query
  })
}

// 查询系统发送邮件内容详细
export function getCont(id) {
  return request({
    url: '/xinhu-police/cont/' + id,
    method: 'get'
  })
}

// 新增系统发送邮件内容
export function addCont(data) {
  return request({
    url: '/xinhu-police/cont',
    method: 'post',
    data: data
  })
}

// 修改系统发送邮件内容
export function updateCont(data) {
  return request({
    url: '/xinhu-police/cont',
    method: 'put',
    data: data
  })
}

// 删除系统发送邮件内容
export function delCont(id) {
  return request({
    url: '/xinhu-police/cont/' + id,
    method: 'delete'
  })
}
