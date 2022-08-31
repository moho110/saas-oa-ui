import request from '@/utils/request'

// 查询单据提醒设置列表
export function listRemind(query) {
  return request({
    url: '/xinhu-flow/remind/list',
    method: 'get',
    params: query
  })
}

// 查询单据提醒设置详细
export function getRemind(id) {
  return request({
    url: '/xinhu-flow/remind/' + id,
    method: 'get'
  })
}

// 新增单据提醒设置
export function addRemind(data) {
  return request({
    url: '/xinhu-flow/remind',
    method: 'post',
    data: data
  })
}

// 修改单据提醒设置
export function updateRemind(data) {
  return request({
    url: '/xinhu-flow/remind',
    method: 'put',
    data: data
  })
}

// 删除单据提醒设置
export function delRemind(id) {
  return request({
    url: '/xinhu-flow/remind/' + id,
    method: 'delete'
  })
}
