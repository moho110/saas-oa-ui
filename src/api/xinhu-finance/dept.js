import request from '@/utils/request'

// 查询组织结构部门列表
export function listDept(query) {
  return request({
    url: '/xinhu-finance/dept/list',
    method: 'get',
    params: query
  })
}

// 查询组织结构部门详细
export function getDept(id) {
  return request({
    url: '/xinhu-finance/dept/' + id,
    method: 'get'
  })
}

// 新增组织结构部门
export function addDept(data) {
  return request({
    url: '/xinhu-finance/dept',
    method: 'post',
    data: data
  })
}

// 修改组织结构部门
export function updateDept(data) {
  return request({
    url: '/xinhu-finance/dept',
    method: 'put',
    data: data
  })
}

// 删除组织结构部门
export function delDept(id) {
  return request({
    url: '/xinhu-finance/dept/' + id,
    method: 'delete'
  })
}
