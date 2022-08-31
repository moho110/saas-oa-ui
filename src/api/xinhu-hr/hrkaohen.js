import request from '@/utils/request'

// 查询考核项目人员列表
export function listHrkaohen(query) {
  return request({
    url: '/xinhu-hr/hrkaohen/list',
    method: 'get',
    params: query
  })
}

// 查询考核项目人员详细
export function getHrkaohen(id) {
  return request({
    url: '/xinhu-hr/hrkaohen/' + id,
    method: 'get'
  })
}

// 新增考核项目人员
export function addHrkaohen(data) {
  return request({
    url: '/xinhu-hr/hrkaohen',
    method: 'post',
    data: data
  })
}

// 修改考核项目人员
export function updateHrkaohen(data) {
  return request({
    url: '/xinhu-hr/hrkaohen',
    method: 'put',
    data: data
  })
}

// 删除考核项目人员
export function delHrkaohen(id) {
  return request({
    url: '/xinhu-hr/hrkaohen/' + id,
    method: 'delete'
  })
}
