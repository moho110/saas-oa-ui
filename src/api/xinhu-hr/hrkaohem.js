import request from '@/utils/request'

// 查询考核项目列表
export function listHrkaohem(query) {
  return request({
    url: '/xinhu-hr/hrkaohem/list',
    method: 'get',
    params: query
  })
}

// 查询考核项目详细
export function getHrkaohem(id) {
  return request({
    url: '/xinhu-hr/hrkaohem/' + id,
    method: 'get'
  })
}

// 新增考核项目
export function addHrkaohem(data) {
  return request({
    url: '/xinhu-hr/hrkaohem',
    method: 'post',
    data: data
  })
}

// 修改考核项目
export function updateHrkaohem(data) {
  return request({
    url: '/xinhu-hr/hrkaohem',
    method: 'put',
    data: data
  })
}

// 删除考核项目
export function delHrkaohem(id) {
  return request({
    url: '/xinhu-hr/hrkaohem/' + id,
    method: 'delete'
  })
}
