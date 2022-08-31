import request from '@/utils/request'

// 查询通知公告列表
export function listInfor(query) {
  return request({
    url: '/xinhu-hr/infor/list',
    method: 'get',
    params: query
  })
}

// 查询通知公告详细
export function getInfor(id) {
  return request({
    url: '/xinhu-hr/infor/' + id,
    method: 'get'
  })
}

// 新增通知公告
export function addInfor(data) {
  return request({
    url: '/xinhu-hr/infor',
    method: 'post',
    data: data
  })
}

// 修改通知公告
export function updateInfor(data) {
  return request({
    url: '/xinhu-hr/infor',
    method: 'put',
    data: data
  })
}

// 删除通知公告
export function delInfor(id) {
  return request({
    url: '/xinhu-hr/infor/' + id,
    method: 'delete'
  })
}
