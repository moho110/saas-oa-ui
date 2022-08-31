import request from '@/utils/request'

// 查询问卷子列表
export function listWenjuat(query) {
  return request({
    url: '/xinhu-document/wenjuat/list',
    method: 'get',
    params: query
  })
}

// 查询问卷子详细
export function getWenjuat(id) {
  return request({
    url: '/xinhu-document/wenjuat/' + id,
    method: 'get'
  })
}

// 新增问卷子
export function addWenjuat(data) {
  return request({
    url: '/xinhu-document/wenjuat',
    method: 'post',
    data: data
  })
}

// 修改问卷子
export function updateWenjuat(data) {
  return request({
    url: '/xinhu-document/wenjuat',
    method: 'put',
    data: data
  })
}

// 删除问卷子
export function delWenjuat(id) {
  return request({
    url: '/xinhu-document/wenjuat/' + id,
    method: 'delete'
  })
}
