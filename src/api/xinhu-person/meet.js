import request from '@/utils/request'

// 查询会议列表
export function listMeet(query) {
  return request({
    url: '/xinhu-person/meet/list',
    method: 'get',
    params: query
  })
}

// 查询会议详细
export function getMeet(id) {
  return request({
    url: '/xinhu-person/meet/' + id,
    method: 'get'
  })
}

// 新增会议
export function addMeet(data) {
  return request({
    url: '/xinhu-person/meet',
    method: 'post',
    data: data
  })
}

// 修改会议
export function updateMeet(data) {
  return request({
    url: '/xinhu-person/meet',
    method: 'put',
    data: data
  })
}

// 删除会议
export function delMeet(id) {
  return request({
    url: '/xinhu-person/meet/' + id,
    method: 'delete'
  })
}
