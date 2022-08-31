import request from '@/utils/request'

// 查询面试和人员需求列表
export function listHrdemint(query) {
  return request({
    url: '/xinhu-hr/hrdemint/list',
    method: 'get',
    params: query
  })
}

// 查询面试和人员需求详细
export function getHrdemint(id) {
  return request({
    url: '/xinhu-hr/hrdemint/' + id,
    method: 'get'
  })
}

// 新增面试和人员需求
export function addHrdemint(data) {
  return request({
    url: '/xinhu-hr/hrdemint',
    method: 'post',
    data: data
  })
}

// 修改面试和人员需求
export function updateHrdemint(data) {
  return request({
    url: '/xinhu-hr/hrdemint',
    method: 'put',
    data: data
  })
}

// 删除面试和人员需求
export function delHrdemint(id) {
  return request({
    url: '/xinhu-hr/hrdemint/' + id,
    method: 'delete'
  })
}
