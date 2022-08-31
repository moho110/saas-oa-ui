import request from '@/utils/request'

// 查询IM下应用菜单列表
export function listMenu(query) {
  return request({
    url: '/xinhu-hr/menu/list',
    method: 'get',
    params: query
  })
}

// 查询IM下应用菜单详细
export function getMenu(id) {
  return request({
    url: '/xinhu-hr/menu/' + id,
    method: 'get'
  })
}

// 新增IM下应用菜单
export function addMenu(data) {
  return request({
    url: '/xinhu-hr/menu',
    method: 'post',
    data: data
  })
}

// 修改IM下应用菜单
export function updateMenu(data) {
  return request({
    url: '/xinhu-hr/menu',
    method: 'put',
    data: data
  })
}

// 删除IM下应用菜单
export function delMenu(id) {
  return request({
    url: '/xinhu-hr/menu/' + id,
    method: 'delete'
  })
}
