import request from '@/utils/request'

// 查询系统升级列表
export function listChargems(query) {
  return request({
    url: '/xinhu-system/chargems/list',
    method: 'get',
    params: query
  })
}

// 查询系统升级详细
export function getChargems(id) {
  return request({
    url: '/xinhu-system/chargems/' + id,
    method: 'get'
  })
}

// 新增系统升级
export function addChargems(data) {
  return request({
    url: '/xinhu-system/chargems',
    method: 'post',
    data: data
  })
}

// 修改系统升级
export function updateChargems(data) {
  return request({
    url: '/xinhu-system/chargems',
    method: 'put',
    data: data
  })
}

// 删除系统升级
export function delChargems(id) {
  return request({
    url: '/xinhu-system/chargems/' + id,
    method: 'delete'
  })
}
