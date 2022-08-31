import request from '@/utils/request'

// 查询固定资产列表
export function listAssetm(query) {
  return request({
    url: '/xinhu-police/assetm/list',
    method: 'get',
    params: query
  })
}

// 查询固定资产详细
export function getAssetm(id) {
  return request({
    url: '/xinhu-police/assetm/' + id,
    method: 'get'
  })
}

// 新增固定资产
export function addAssetm(data) {
  return request({
    url: '/xinhu-police/assetm',
    method: 'post',
    data: data
  })
}

// 修改固定资产
export function updateAssetm(data) {
  return request({
    url: '/xinhu-police/assetm',
    method: 'put',
    data: data
  })
}

// 删除固定资产
export function delAssetm(id) {
  return request({
    url: '/xinhu-police/assetm/' + id,
    method: 'delete'
  })
}
