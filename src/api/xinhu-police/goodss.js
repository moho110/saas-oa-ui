import request from '@/utils/request'

// 查询物品库存详细列表
export function listGoodss(query) {
  return request({
    url: '/xinhu-police/goodss/list',
    method: 'get',
    params: query
  })
}

// 查询物品库存详细详细
export function getGoodss(id) {
  return request({
    url: '/xinhu-police/goodss/' + id,
    method: 'get'
  })
}

// 新增物品库存详细
export function addGoodss(data) {
  return request({
    url: '/xinhu-police/goodss',
    method: 'post',
    data: data
  })
}

// 修改物品库存详细
export function updateGoodss(data) {
  return request({
    url: '/xinhu-police/goodss',
    method: 'put',
    data: data
  })
}

// 删除物品库存详细
export function delGoodss(id) {
  return request({
    url: '/xinhu-police/goodss/' + id,
    method: 'delete'
  })
}
