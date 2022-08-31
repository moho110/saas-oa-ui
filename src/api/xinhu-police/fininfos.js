import request from '@/utils/request'

// 查询费用报销子列表
export function listFininfos(query) {
  return request({
    url: '/xinhu-police/fininfos/list',
    method: 'get',
    params: query
  })
}

// 查询费用报销子详细
export function getFininfos(id) {
  return request({
    url: '/xinhu-police/fininfos/' + id,
    method: 'get'
  })
}

// 新增费用报销子
export function addFininfos(data) {
  return request({
    url: '/xinhu-police/fininfos',
    method: 'post',
    data: data
  })
}

// 修改费用报销子
export function updateFininfos(data) {
  return request({
    url: '/xinhu-police/fininfos',
    method: 'put',
    data: data
  })
}

// 删除费用报销子
export function delFininfos(id) {
  return request({
    url: '/xinhu-police/fininfos/' + id,
    method: 'delete'
  })
}
