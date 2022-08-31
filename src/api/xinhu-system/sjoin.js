import request from '@/utils/request'

// 查询后台菜单权限列表
export function listSjoin(query) {
  return request({
    url: '/xinhu-system/sjoin/list',
    method: 'get',
    params: query
  })
}

// 查询后台菜单权限详细
export function getSjoin(id) {
  return request({
    url: '/xinhu-system/sjoin/' + id,
    method: 'get'
  })
}

// 新增后台菜单权限
export function addSjoin(data) {
  return request({
    url: '/xinhu-system/sjoin',
    method: 'post',
    data: data
  })
}

// 修改后台菜单权限
export function updateSjoin(data) {
  return request({
    url: '/xinhu-system/sjoin',
    method: 'put',
    data: data
  })
}

// 删除后台菜单权限
export function delSjoin(id) {
  return request({
    url: '/xinhu-system/sjoin/' + id,
    method: 'delete'
  })
}
