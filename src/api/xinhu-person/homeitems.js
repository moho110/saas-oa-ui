import request from '@/utils/request'

// 查询桌面项目列表
export function listHomeitems(query) {
  return request({
    url: '/xinhu-person/homeitems/list',
    method: 'get',
    params: query
  })
}

// 查询桌面项目详细
export function getHomeitems(id) {
  return request({
    url: '/xinhu-person/homeitems/' + id,
    method: 'get'
  })
}

// 新增桌面项目
export function addHomeitems(data) {
  return request({
    url: '/xinhu-person/homeitems',
    method: 'post',
    data: data
  })
}

// 修改桌面项目
export function updateHomeitems(data) {
  return request({
    url: '/xinhu-person/homeitems',
    method: 'put',
    data: data
  })
}

// 删除桌面项目
export function delHomeitems(id) {
  return request({
    url: '/xinhu-person/homeitems/' + id,
    method: 'delete'
  })
}
