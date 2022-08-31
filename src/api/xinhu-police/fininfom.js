import request from '@/utils/request'

// 查询费用报销列表
export function listFininfom(query) {
  return request({
    url: '/xinhu-police/fininfom/list',
    method: 'get',
    params: query
  })
}

// 查询费用报销详细
export function getFininfom(id) {
  return request({
    url: '/xinhu-police/fininfom/' + id,
    method: 'get'
  })
}

// 新增费用报销
export function addFininfom(data) {
  return request({
    url: '/xinhu-police/fininfom',
    method: 'post',
    data: data
  })
}

// 修改费用报销
export function updateFininfom(data) {
  return request({
    url: '/xinhu-police/fininfom',
    method: 'put',
    data: data
  })
}

// 删除费用报销
export function delFininfom(id) {
  return request({
    url: '/xinhu-police/fininfom/' + id,
    method: 'delete'
  })
}
