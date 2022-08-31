import request from '@/utils/request'

// 查询信息子投票项列表
export function listInfors(query) {
  return request({
    url: '/xinhu-hr/infors/list',
    method: 'get',
    params: query
  })
}

// 查询信息子投票项详细
export function getInfors(id) {
  return request({
    url: '/xinhu-hr/infors/' + id,
    method: 'get'
  })
}

// 新增信息子投票项
export function addInfors(data) {
  return request({
    url: '/xinhu-hr/infors',
    method: 'post',
    data: data
  })
}

// 修改信息子投票项
export function updateInfors(data) {
  return request({
    url: '/xinhu-hr/infors',
    method: 'put',
    data: data
  })
}

// 删除信息子投票项
export function delInfors(id) {
  return request({
    url: '/xinhu-hr/infors/' + id,
    method: 'delete'
  })
}
