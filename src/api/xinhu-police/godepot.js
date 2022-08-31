import request from '@/utils/request'

// 查询物品仓库列表
export function listGodepot(query) {
  return request({
    url: '/xinhu-police/godepot/list',
    method: 'get',
    params: query
  })
}

// 查询物品仓库详细
export function getGodepot(id) {
  return request({
    url: '/xinhu-police/godepot/' + id,
    method: 'get'
  })
}

// 新增物品仓库
export function addGodepot(data) {
  return request({
    url: '/xinhu-police/godepot',
    method: 'post',
    data: data
  })
}

// 修改物品仓库
export function updateGodepot(data) {
  return request({
    url: '/xinhu-police/godepot',
    method: 'put',
    data: data
  })
}

// 删除物品仓库
export function delGodepot(id) {
  return request({
    url: '/xinhu-police/godepot/' + id,
    method: 'delete'
  })
}
