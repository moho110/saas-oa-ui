import request from '@/utils/request'

// 查询物品库存详细列表
export function listGoodn(query) {
  return request({
    url: '/xinhu-police/goodn/list',
    method: 'get',
    params: query
  })
}

// 查询物品库存详细详细
export function getGoodn(id) {
  return request({
    url: '/xinhu-police/goodn/' + id,
    method: 'get'
  })
}

// 新增物品库存详细
export function addGoodn(data) {
  return request({
    url: '/xinhu-police/goodn',
    method: 'post',
    data: data
  })
}

// 修改物品库存详细
export function updateGoodn(data) {
  return request({
    url: '/xinhu-police/goodn',
    method: 'put',
    data: data
  })
}

// 删除物品库存详细
export function delGoodn(id) {
  return request({
    url: '/xinhu-police/goodn/' + id,
    method: 'delete'
  })
}
