import request from '@/utils/request'

// 查询抄送列表
export function listChao(query) {
  return request({
    url: '/xinhu-police/chao/list',
    method: 'get',
    params: query
  })
}

// 查询抄送详细
export function getChao(id) {
  return request({
    url: '/xinhu-police/chao/' + id,
    method: 'get'
  })
}

// 新增抄送
export function addChao(data) {
  return request({
    url: '/xinhu-police/chao',
    method: 'post',
    data: data
  })
}

// 修改抄送
export function updateChao(data) {
  return request({
    url: '/xinhu-police/chao',
    method: 'put',
    data: data
  })
}

// 删除抄送
export function delChao(id) {
  return request({
    url: '/xinhu-police/chao/' + id,
    method: 'delete'
  })
}
