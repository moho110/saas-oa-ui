import request from '@/utils/request'

// 查询微信公众号消息模版列表
export function listWotpl(query) {
  return request({
    url: '/xinhu-system/wotpl/list',
    method: 'get',
    params: query
  })
}

// 查询微信公众号消息模版详细
export function getWotpl(id) {
  return request({
    url: '/xinhu-system/wotpl/' + id,
    method: 'get'
  })
}

// 新增微信公众号消息模版
export function addWotpl(data) {
  return request({
    url: '/xinhu-system/wotpl',
    method: 'post',
    data: data
  })
}

// 修改微信公众号消息模版
export function updateWotpl(data) {
  return request({
    url: '/xinhu-system/wotpl',
    method: 'put',
    data: data
  })
}

// 删除微信公众号消息模版
export function delWotpl(id) {
  return request({
    url: '/xinhu-system/wotpl/' + id,
    method: 'delete'
  })
}
