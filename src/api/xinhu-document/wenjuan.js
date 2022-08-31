import request from '@/utils/request'

// 查询问卷列表
export function listWenjuan(query) {
  return request({
    url: '/xinhu-document/wenjuan/list',
    method: 'get',
    params: query
  })
}

// 查询问卷详细
export function getWenjuan(id) {
  return request({
    url: '/xinhu-document/wenjuan/' + id,
    method: 'get'
  })
}

// 新增问卷
export function addWenjuan(data) {
  return request({
    url: '/xinhu-document/wenjuan',
    method: 'post',
    data: data
  })
}

// 修改问卷
export function updateWenjuan(data) {
  return request({
    url: '/xinhu-document/wenjuan',
    method: 'put',
    data: data
  })
}

// 删除问卷
export function delWenjuan(id) {
  return request({
    url: '/xinhu-document/wenjuan/' + id,
    method: 'delete'
  })
}
