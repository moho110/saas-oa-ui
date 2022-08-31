import request from '@/utils/request'

// 查询打卡记录列表
export function listKqdkjl(query) {
  return request({
    url: '/xinhu-hr/kqdkjl/list',
    method: 'get',
    params: query
  })
}

// 查询打卡记录详细
export function getKqdkjl(id) {
  return request({
    url: '/xinhu-hr/kqdkjl/' + id,
    method: 'get'
  })
}

// 新增打卡记录
export function addKqdkjl(data) {
  return request({
    url: '/xinhu-hr/kqdkjl',
    method: 'post',
    data: data
  })
}

// 修改打卡记录
export function updateKqdkjl(data) {
  return request({
    url: '/xinhu-hr/kqdkjl',
    method: 'put',
    data: data
  })
}

// 删除打卡记录
export function delKqdkjl(id) {
  return request({
    url: '/xinhu-hr/kqdkjl/' + id,
    method: 'delete'
  })
}
