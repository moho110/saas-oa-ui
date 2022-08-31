import request from '@/utils/request'

// 查询公司单位列表
export function listCompany(query) {
  return request({
    url: '/xinhu-person/company/list',
    method: 'get',
    params: query
  })
}

// 查询公司单位详细
export function getCompany(id) {
  return request({
    url: '/xinhu-person/company/' + id,
    method: 'get'
  })
}

// 新增公司单位
export function addCompany(data) {
  return request({
    url: '/xinhu-person/company',
    method: 'post',
    data: data
  })
}

// 修改公司单位
export function updateCompany(data) {
  return request({
    url: '/xinhu-person/company',
    method: 'put',
    data: data
  })
}

// 删除公司单位
export function delCompany(id) {
  return request({
    url: '/xinhu-person/company/' + id,
    method: 'delete'
  })
}
