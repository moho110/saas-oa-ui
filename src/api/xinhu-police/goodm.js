import request from '@/utils/request'

// 查询物品领用采购申请主列表
export function listGoodm(query) {
  return request({
    url: '/xinhu-police/goodm/list',
    method: 'get',
    params: query
  })
}

// 查询物品领用采购申请主详细
export function getGoodm(id) {
  return request({
    url: '/xinhu-police/goodm/' + id,
    method: 'get'
  })
}

// 新增物品领用采购申请主
export function addGoodm(data) {
  return request({
    url: '/xinhu-police/goodm',
    method: 'post',
    data: data
  })
}

// 修改物品领用采购申请主
export function updateGoodm(data) {
  return request({
    url: '/xinhu-police/goodm',
    method: 'put',
    data: data
  })
}

// 删除物品领用采购申请主
export function delGoodm(id) {
  return request({
    url: '/xinhu-police/goodm/' + id,
    method: 'delete'
  })
}
