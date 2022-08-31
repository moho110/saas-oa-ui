import request from '@/utils/request'

// 查询公文列表
export function listOfficial(query) {
  return request({
    url: '/xinhu-document/official/list',
    method: 'get',
    params: query
  })
}

// 查询公文详细
export function getOfficial(id) {
  return request({
    url: '/xinhu-document/official/' + id,
    method: 'get'
  })
}

// 新增公文
export function addOfficial(data) {
  return request({
    url: '/xinhu-document/official',
    method: 'post',
    data: data
  })
}

// 修改公文
export function updateOfficial(data) {
  return request({
    url: '/xinhu-document/official',
    method: 'put',
    data: data
  })
}

// 删除公文
export function delOfficial(id) {
  return request({
    url: '/xinhu-document/official/' + id,
    method: 'delete'
  })
}
