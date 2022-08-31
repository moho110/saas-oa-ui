import request from '@/utils/request'

// 查询问卷子列表
export function listWenjuau(query) {
  return request({
    url: '/xinhu-document/wenjuau/list',
    method: 'get',
    params: query
  })
}

// 查询问卷子详细
export function getWenjuau(id) {
  return request({
    url: '/xinhu-document/wenjuau/' + id,
    method: 'get'
  })
}

// 新增问卷子
export function addWenjuau(data) {
  return request({
    url: '/xinhu-document/wenjuau',
    method: 'post',
    data: data
  })
}

// 修改问卷子
export function updateWenjuau(data) {
  return request({
    url: '/xinhu-document/wenjuau',
    method: 'put',
    data: data
  })
}

// 删除问卷子
export function delWenjuau(id) {
  return request({
    url: '/xinhu-document/wenjuau/' + id,
    method: 'delete'
  })
}
